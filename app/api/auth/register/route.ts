import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    const existing = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rowCount && existing.rowCount > 0) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashed]
    );

    return NextResponse.json(result.rows[0], { status: 201 });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 }
    );
  }
}