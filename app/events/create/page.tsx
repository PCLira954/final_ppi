"use client"
import { useState } from "react"

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    start_at: "",
    end_at: "",
  })

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: any) {
    e.preventDefault()

    const token = localStorage.getItem("token")

    const res = await fetch("/api/events", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    alert("Evento criado!")
    window.location.href = `/events/${data.id}`
  }

  return (
    <div>
      <h1>Criar Evento</h1>

      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Título" onChange={handleChange} />
        <input name="description" placeholder="Descrição" onChange={handleChange} />
        <input name="location" placeholder="Local" onChange={handleChange} />
        <input name="start_at" type="datetime-local" onChange={handleChange} />
        <input name="end_at" type="datetime-local" onChange={handleChange} />

        <button>Criar</button>
      </form>
    </div>
  )
}