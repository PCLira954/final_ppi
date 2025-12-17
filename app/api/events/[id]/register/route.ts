import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  req: Request,
  { params }: RouteContext
) {
  // 🚨 SE ISSO NÃO FOR await, O ERRO CONTINUA
  const { id: eventId } = await params;

  if (!eventId) {
    return NextResponse.json(
      { error: "ID do evento inválido" },
      { status: 400 }
    );
  }

  const authUser = await getUserFromAuthHeader(
    req.headers.get("authorization") ?? undefined
  );

  if (!authUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const eventCheck = await db.query(
    `SELECT id FROM events WHERE id = $1`,
    [eventId]
  );

  if (!eventCheck.rowCount) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  const alreadyRegistered = await db.query(
    `
    SELECT id
    FROM registrations
    WHERE event_id = $1 AND user_id = $2
    `,
    [eventId, authUser.id]
  );

  if (alreadyRegistered.rowCount) {
    return NextResponse.json(
      { error: "Usuário já inscrito neste evento" },
      { status: 409 }
    );
  }

  const res = await db.query(
    `
    INSERT INTO registrations (
      event_id,
      user_id,
      status,
      created_at
    )
    VALUES ($1, $2, 'pending', NOW())
    RETURNING *
    `,
    [eventId, authUser.id]
  );

  return NextResponse.json(res.rows[0], { status: 201 });
}
