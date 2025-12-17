"use client"
import { useEffect, useState } from "react"

export default function AdminRegistrations() {
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/registrations")
      .then(r => r.json())
      .then(setItems)
  }, [])

  async function update(id: string, status: string) {
    await fetch(`/api/registrations/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
    setItems(items.filter(i => i.id !== id))
  }

  return (
    <main>
      <h1>Inscrições Pendentes</h1>

      {items.map(i => (
        <div key={i.id}>
          <p>{i.name} → {i.title}</p>
          <button onClick={() => update(i.id, "approved")}>Aprovar</button>
          <button onClick={() => update(i.id, "rejected")}>Recusar</button>
        </div>
      ))}
    </main>
  )
}