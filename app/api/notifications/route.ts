import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  const { user_id, message } = await req.json()

  await db.query(
    "INSERT INTO notifications (user_id, message) VALUES ($1,$2)",
    [user_id, message]
  )

  return NextResponse.json({ ok: true })
}