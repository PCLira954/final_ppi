"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

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

      const text = await res.text();
      let data: any = null;

      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

      if (!res.ok) {
        setMessage(data?.error || "Email ou senha inválidos");
        return;
      }

      // ✅ Salva token (caso use JWT)
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      setMessage("Login realizado com sucesso!");

      // ✅ Redireciona para o dashboard
      router.push("/dashboard");

    } catch (err) {
      console.error(err);
      setMessage("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" disabled={loading} style={{ width: "100%" }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}

      <hr style={{ margin: "20px 0" }} />

      <p>
        Não tem conta?{" "}
        <a href="/auth/register">Criar cadastro</a>
      </p>
    </main>
  );
}
