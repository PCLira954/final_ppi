import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await db.query(`DELETE FROM event_registrations WHERE id=$1`, [params.id]);

  return NextResponse.json({ message: "Deleted" });
}
