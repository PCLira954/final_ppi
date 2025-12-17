import Link from "next/link";
import { db } from "@/lib/db";

export default async function HomePage() {
  const res = await db.query(`
    SELECT id, title, start_at, location
    FROM events
    ORDER BY start_at ASC
  `);

  const events = res.rows;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">📅 Eventos</h1>

      <div className="grid gap-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="block border rounded p-4 hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold">{event.title}</h2>
            <p>{event.location}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
