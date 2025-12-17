"use client"
import { useState } from "react"

export default function CheckinPage() {
  const [id, setId] = useState("")

  async function checkin() {
    await fetch("/api/checkin", {
      method: "POST",
      body: JSON.stringify({ registrationId: id }),
    })
    alert("Check-in realizado")
  }

  return (
    <main>
      <h1>Check-in Manual</h1>
      <input
        placeholder="ID da inscrição"
        onChange={e => setId(e.target.value)}
      />
      <button onClick={checkin}>Confirmar</button>
    </main>
  )
}