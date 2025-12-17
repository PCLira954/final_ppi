import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromAuthHeader } from "@/lib/auth";

// Validação simples de UUID
function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function POST(req: Request) {
  try {
    // 🔐 Autenticação
    const authUser = await getUserFromAuthHeader(
      req.headers.get("authorization") ?? undefined
    );

    if (!authUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 📥 Body
    const body = await req.json();
    const { registrationId } = body;

    if (!registrationId) {
      return NextResponse.json(
        { error: "registrationId é obrigatório" },
        { status: 400 }
      );
    }

    if (!isUUID(registrationId)) {
      return NextResponse.json(
        { error: "registrationId inválido (UUID esperado)" },
        { status: 400 }
      );
    }

    // 🧾 Atualiza check-in
    const res = await db.query(
      `
      UPDATE registrations
      SET checked_in = true
      WHERE id = $1
      RETURNING id, checked_in
      `,
      [registrationId]
    );

    if (!res.rowCount) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      registration: res.rows[0],
    });
  } catch (error) {
    console.error("CHECK-IN ERROR:", error);
    return NextResponse.json(
      { error: "Erro interno ao realizar check-in" },
      { status: 500 }
    )
  }
}
