"use client"

export default function RegisterEvent({ params }: any) {
  async function handleRegister() {
    const token = localStorage.getItem("token")

    const res = await fetch(`/api/events/${params.id}/register`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })

    const data = await res.json()

    alert("Inscrição enviada!")
    window.location.href = "/"
  }

  return (
    <div>
      <h1>Inscrever-se no evento</h1>
      <button onClick={handleRegister}>Confirmar inscrição</button>
    </div>
  )
}