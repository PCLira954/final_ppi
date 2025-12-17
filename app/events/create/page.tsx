"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_at: "",
    end_at: "",
  });

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 🔐 PROTEÇÃO DE ROTA (AQUI MESMO)
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        setMsg(data?.error || "Erro ao criar evento");
        return;
      }

      router.push(`/events/${data.id}`);
    } catch (error) {
      console.error(error);
      setMsg("Erro interno ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  // ⏳ Enquanto verifica autenticação
  if (checkingAuth) {
    return <p style={{ padding: 20 }}>Verificando autenticação...</p>;
  }

  return (
    <main style={{ padding: 20, maxWidth: 500 }}>
      <h1>Criar Evento</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          required
        />
        <br />

        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="location"
          placeholder="Local"
          value={form.location}
          onChange={handleChange}
        />
        <br />

        <input
          name="start_at"
          type="datetime-local"
          value={form.start_at}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="end_at"
          type="datetime-local"
          value={form.end_at}
          onChange={handleChange}
          required
        />
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar Evento"}
        </button>
      </form>

      {msg && <p>{msg}</p>}
    </main>
  );
}