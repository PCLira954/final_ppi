"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text(); // 👈 SEMPRE TEXTO PRIMEIRO
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

      if (!res.ok) {
        setMessage(data?.error || "Erro ao fazer login");
        return;
      }

      console.log("LOGIN OK:", data);
      setMessage("Login realizado com sucesso!");
    } catch (err: any) {
      console.error(err);
      setMessage("Erro interno ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <br />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}
