// GET /api/events/:id/registrations
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const eventId = params.id;
  const user = await getUserFromAuthHeader(req.headers.get("authorization") ?? undefined);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // check owner
  const ev = await db.query("SELECT organizer_id FROM events WHERE id=$1", [eventId]);
  if (!ev.rowCount) return NextResponse.json({ error: "Evento não encontrado" }, { status: 404 });
  if (ev.rows[0].organizer_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const res = await db.query(
    `SELECT r.*, u.name as user_name, u.email as user_email
     FROM event_registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id = $1
     ORDER BY r.applied_at ASC`,
    [eventId]
  );

  return NextResponse.json(res.rows);
}
