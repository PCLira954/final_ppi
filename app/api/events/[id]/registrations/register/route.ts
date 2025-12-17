// POST /api/events/:id/registrations/register
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const eventId = params.id;
  const user = await getUserFromAuthHeader(req.headers.get("authorization") ?? undefined);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // check event exists
  const ev = await db.query("SELECT id, organizer_id FROM events WHERE id = $1", [eventId]);
  if (!ev.rowCount) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });

  // check if already registered
  const exists = await db.query("SELECT id, status FROM event_registrations WHERE event_id=$1 AND user_id=$2", [eventId, user.id]);
  if (exists.rowCount) return NextResponse.json({ error: "Já inscrito", registration: exists.rows[0] }, { status: 400 });

  // by default pending (organizer approval) — you can change to 'approved' to auto-approve
  const status = ev.rows[0].requires_approval ? "pending" : "approved"; // if you have this column
  // For now assume manual approval: pending
  const res = await db.query(
    `INSERT INTO event_registrations (event_id, user_id, status) VALUES ($1,$2,$3) RETURNING *`,
    [eventId, user.id, "pending"]
  );
  return NextResponse.json(res.rows[0], { status: 201 });
}
