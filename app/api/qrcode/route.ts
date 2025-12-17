import QRCode from "qrcode";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const registrationId = searchParams.get("id");

    if (!registrationId) {
      return NextResponse.json(
        { error: "ID da inscrição não informado" },
        { status: 400 }
      );
    }

    // 🔎 Verifica se a inscrição existe
    const result = await db.query(
      "SELECT id FROM registrations WHERE id = $1",
      [registrationId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Inscrição não encontrada" },
        { status: 404 }
      );
    }

    // 🎟️ Conteúdo do QR Code
    const payload = JSON.stringify({
      type: "CHECKIN",
      registrationId,
    });

    const qrCode = await QRCode.toDataURL(payload);

    return NextResponse.json({ qrCode });
  } catch (error) {
    console.error("Erro ao gerar QR Code:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar QR Code" },
      { status: 500 }
    );
  }
}
