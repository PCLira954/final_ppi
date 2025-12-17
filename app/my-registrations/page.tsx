"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Registration = {
  id: string;
  event_title: string;
  status: string;
};

export default function MyRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/auth/login");
      return;
    }

    async function loadRegistrations() {
      try {
        const res = await fetch("/api/registrations/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erro ao buscar inscrições");
        }

        const data = await res.json();
        setRegistrations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRegistrations();
  }, [router]);

  if (loading) {
    return <p className="p-6">Carregando...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        📝 Minhas Inscrições
      </h1>

      {registrations.length === 0 ? (
        <p>Você ainda não se inscreveu em nenhum evento.</p>
      ) : (
        <ul className="space-y-4">
          {registrations.map((r) => (
            <li
              key={r.id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <h2 className="text-xl font-semibold">
                {r.event_title}
              </h2>
              <p>Status: {r.status}</p>

              <Link
                href={`/ticket/${r.id}`}
                className="text-blue-600 underline mt-2 inline-block"
              >
                Ver ingresso
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}