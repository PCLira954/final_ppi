import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const res = await db.query(
    `SELECT * FROM events WHERE id = $1`,
    [id]
  );

  if (res.rows.length === 0) {
    return NextResponse.json(
      { error: "Evento não encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json(res.rows[0]);
}

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  start_at: string;
};

async function getEvent(id: string) {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);

  if (!event) {
    return (
      <main className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Evento não encontrado
        </h1>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>

      <p className="text-gray-700 mb-4">{event.description}</p>

      <p className="text-sm text-gray-500 mb-2">
        📍 {event.location}
      </p>

      <p className="text-sm text-gray-500 mb-6">
        🕒 {new Date(event.start_at).toLocaleString()}
      </p>

      <a
        href={`/events/${id}/register`}
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Inscrever-se
      </a>
    </main>
  );
}
