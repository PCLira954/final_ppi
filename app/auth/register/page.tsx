"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await res.text(); // 👈 SEMPRE TEXTO
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

      if (!res.ok) {
        setMsg(data?.error || "Erro ao registrar");
        return;
      }

      setMsg("Usuário criado com sucesso!");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setMsg("Erro interno ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nome"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <br />

        <input
          placeholder="Senha"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
      </form>

      <p>{msg}</p>
    </div>
  );
}
