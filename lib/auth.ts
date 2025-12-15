// lib/auth.ts
import jwt from "jsonwebtoken";
import { db } from "./db";

export function verifyToken(token?: string) {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;
    return payload; // { id, email, iat, exp }
  } catch {
    return null;
  }
}

export async function getUserFromAuthHeader(authorization?: string) {
  if (!authorization) return null;
  const parts = authorization.split(" ");
  if (parts.length !== 2) return null;
  const token = parts[1];
  const payload = verifyToken(token);
  if (!payload) return null;
  const res = await db.query("SELECT id, name, email FROM users WHERE id = $1", [payload.id]);
  return res.rows[0] ?? null;
}