async function getEvent(id: string) {
  const res = await fetch(`http://localhost:3000/api/events/${id}`, {
    cache: "no-store",
  })
  return res.json()
}

export default async function EventPage({ params }: any) {
  const event = await getEvent(params.id)

  return (
    <div>
      <h1>{event.title}</h1>
      <p>{event.description}</p>

      <a href={`/events/${params.id}/register`}>Inscrever-se</a>
    </div>
  )
}