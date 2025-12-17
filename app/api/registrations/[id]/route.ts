import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json(); // approved | rejected

    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    // Atualiza status da inscrição
    await db.query(
      `UPDATE registrations
       SET status = $1
       WHERE id = $2`,
      [status, params.id]
    );

    // Busca o usuário da inscrição
    const reg = await db.query(
      `SELECT user_id FROM registrations WHERE id = $1`,
      [params.id]
    );

    if (reg.rows.length === 0) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    // Cria notificação
    await db.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)`,
      [
        reg.rows[0].user_id,
        status === "approved"
          ? "Sua inscrição foi aprovada 🎉"
          : "Sua inscrição foi recusada ❌",
      ]
    );

    return NextResponse.json({ message: "Status atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar inscrição:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar status da inscrição" },
      { status: 500 }
    );
  }
}