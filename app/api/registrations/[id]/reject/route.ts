import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// PATCH /api/registrations/[id]/reject
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const result = await db.query(
      `UPDATE event_registrations
       SET status = 'rejected'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Registration rejected successfully",
      registration: result.rows[0]
    });

  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}