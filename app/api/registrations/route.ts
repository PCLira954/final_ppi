import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db.query(`
    SELECT r.*, u.name AS user_name, e.title AS event_title
    FROM event_registrations r
    JOIN users u ON u.id = r.user_id
    JOIN events e ON e.id = r.event_id
  `);

  return NextResponse.json(rows.rows);
}

export async function POST(req: Request) {
  const { user_id, event_id } = await req.json();

  const result = await db.query(
    `INSERT INTO event_registrations (user_id, event_id)
     VALUES ($1, $2)
     RETURNING *`,
    [user_id, event_id]
  )

  return NextResponse.json(result.rows[0])
}