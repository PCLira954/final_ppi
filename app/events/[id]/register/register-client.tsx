"use client";

export default function RegisterEvent({
  eventId,
}: {
  eventId: string;
}) {
  async function handleRegister() {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/events/${eventId}/register`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      alert("Erro ao enviar inscrição");
      return;
    }

    alert("Inscrição enviada!");
    window.location.href = "/";
  }

  return (
    <div>
      <h1>Inscrever-se no evento</h1>
      <button onClick={handleRegister}>
        Confirmar inscrição
      </button>
    </div>
  );
}