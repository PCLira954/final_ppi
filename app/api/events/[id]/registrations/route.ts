import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Lista inscrições pendentes de um evento
 * GET /api/events/:id/registrations
 */
export async function GET(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const res = await db.query(
      `
      SELECT 
        r.id,
        r.status,
        r.created_at,
        u.name,
        u.email
      FROM registrations r
      JOIN users u ON u.id = r.user_id
      WHERE r.event_id = $1
        AND r.status = 'pending'
      ORDER BY r.created_at ASC
      `,
      [params.id]
    );

    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Erro ao buscar inscrições pendentes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar inscrições" },
      { status: 500 }
    );
  }
}