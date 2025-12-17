// app/api/events/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

/* =========================
   GET /api/events/[id]
========================= */
export async function GET(
  req: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const res = await db.query(
    `
    SELECT 
      e.*, 
      u.name AS organizer_name
    FROM events e
    JOIN users u ON u.id = e.organizer_id
    WHERE e.id = $1
    `,
    [id]
  );

  const event = res.rows[0];

  if (!event) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(event);
}

/* =========================
   PUT /api/events/[id]
========================= */
export async function PUT(
  req: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const authUser = await getUserFromAuthHeader(
    req.headers.get("authorization") ?? undefined
  );

  if (!authUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verifica se o usuário é o dono do evento
  const ownerCheck = await db.query(
    `SELECT organizer_id FROM events WHERE id = $1`,
    [id]
  );

  if (!ownerCheck.rowCount) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  if (ownerCheck.rows[0].organizer_id !== authUser.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { title, description, location, start_at, end_at } = body;

  const res = await db.query(
    `
    UPDATE events
    SET
      title = $1,
      description = $2,
      location = $3,
      start_at = $4,
      end_at = $5,
      updated_at = NOW()
    WHERE id = $6
    RETURNING *
    `,
    [title, description, location, start_at, end_at, id]
  );

  return NextResponse.json(res.rows[0]);
}

/* =========================
   DELETE /api/events/[id]
========================= */
export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const authUser = await getUserFromAuthHeader(
    req.headers.get("authorization") ?? undefined
  );

  if (!authUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Verifica se o usuário é o dono do evento
  const ownerCheck = await db.query(
    `SELECT organizer_id FROM events WHERE id = $1`,
    [id]
  );

  if (!ownerCheck.rowCount) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  if (ownerCheck.rows[0].organizer_id !== authUser.id) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  await db.query(
    `DELETE FROM events WHERE id = $1`,
    [id]
  );

  return NextResponse.json({ success: true });
}