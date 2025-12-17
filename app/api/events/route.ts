import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function GET() {
  try {
    const res = await db.query(`
      SELECT id, title, description, location, start_at, end_at
      FROM events
      ORDER BY start_at ASC
    `);

    return NextResponse.json(res.rows);
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    return NextResponse.json(
      { error: "Erro ao buscar eventos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getUserFromAuthHeader(
      req.headers.get("authorization") ?? undefined
    );

    if (!authUser) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title, description, location, start_at, end_at } = body;

    if (!title || !description || !start_at || !end_at) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 }
      );
    }

    const res = await db.query(
      `
      INSERT INTO events (title, description, location, start_at, end_at, organizer_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [title, description, location ?? null, start_at, end_at, authUser.id]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err) {
    console.error("Erro ao criar evento:", err);
    return NextResponse.json(
      { error: "Erro ao criar evento" },
      { status: 500 }
    );
  }
}
