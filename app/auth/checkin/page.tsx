"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Validação simples de UUID no frontend
function isUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default function CheckinPage() {
  const router = useRouter();

  const [registrationId, setRegistrationId] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Proteção da página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  async function handleCheckin(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");

    if (!isUUID(registrationId)) {
      setMsg("ID da inscrição inválido (UUID esperado)");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ registrationId }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        setMsg(data?.error || "Erro ao realizar check-in");
        return;
      }

      setMsg("✅ Check-in realizado com sucesso!");
      setRegistrationId("");
    } catch (err) {
      console.error(err);
      setMsg("Erro interno ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Painel de Check-in
        </h1>

        <form onSubmit={handleCheckin} className="space-y-4">
          <input
            type="text"
            placeholder="ID da inscrição (UUID)"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Realizar Check-in"}
          </button>
        </form>

        {msg && (
          <p className="mt-4 text-center text-sm font-medium">
            {msg}
          </p>
        )}
      </div>
    </main>
  );
}