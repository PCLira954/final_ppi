async function getEvents() {
  const res = await fetch("http://localhost:3000/api/events", {
    cache: "no-store",
  });
  return res.json()
}

export default async function Home() {
  const events = await getEvents()

  return (
    <div>
      <h1>Eventos</h1>

      {events.map((ev: any) => (
        <div key={ev.id}>
          <h2>{ev.title}</h2>
          <p>{ev.description}</p>

          <a href={`/events/${ev.id}`}>Ver evento</a>
        </div>
      ))}
    </div>
  )
}