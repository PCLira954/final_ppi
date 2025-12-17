import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");

  if (!auth) {
    return NextResponse.json(
      { error: "Não autorizado" },
      { status: 401 }
    );
  }

  const token = auth.replace("Bearer ", "");

  let userId: string;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    userId = decoded.id;
  } catch {
    return NextResponse.json(
      { error: "Token inválido" },
      { status: 401 }
    );
  }

  const result = await db.query(
    `
    SELECT 
      r.id,
      r.status,
      e.title AS event_title
    FROM registrations r
    JOIN events e ON e.id = r.event_id
    WHERE r.user_id = $1
    ORDER BY r.created_at DESC
    `,
    [userId]
  );

  return NextResponse.json(result.rows);
}