// app/api/events/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function GET() {
  const res = await db.query(
    `SELECT e.*, u.name as organizer_name
     FROM events e
     JOIN users u ON u.id = e.organizer_id
     ORDER BY e.start_at ASC`
  );
  return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  // require auth to create event
  const authUser = await getUserFromAuthHeader(req.headers.get("authorization") ?? undefined);
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // validate required fields
  const { title, description, start_at, end_at, location } = body;
  if (!title || !description || !start_at || !end_at)
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });

  const res = await db.query(
    `INSERT INTO events (title, description, location, start_at, end_at, organizer_id)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [title, description, location ?? null, start_at, end_at, authUser.id]
  );

  return NextResponse.json(res.rows[0], { status: 201 });
}
