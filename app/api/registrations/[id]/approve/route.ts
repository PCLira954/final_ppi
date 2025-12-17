// PUT /api/registrations/:id/approve
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const regId = params.id;
  const user = await getUserFromAuthHeader(req.headers.get("authorization") ?? undefined);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // check registration exists and event owner
  const r = await db.query("SELECT event_id FROM event_registrations WHERE id=$1", [regId]);
  if (!r.rowCount) return NextResponse.json({ error: "Inscrição não encontrada" }, { status: 404 });
  const ev = await db.query("SELECT organizer_id FROM events WHERE id=$1", [r.rows[0].event_id]);
  if (ev.rows[0].organizer_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const res = await db.query("UPDATE event_registrations SET status='approved' WHERE id=$1 RETURNING *", [regId]);
  return NextResponse.json(res.rows[0]);
}