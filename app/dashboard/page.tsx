"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function CardButton({
  href,
  title,
  description,
  bg,
}: {
  href?: string;
  title: string;
  description: string;
  bg: string;
}) {
  const content = (
    <>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-sm opacity-90">{description}</p>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`${bg} text-white rounded-xl shadow p-6 hover:brightness-110 transition text-left`}
      >
        {content}
      </Link>
    );
  }

  return null;
}

export default function DashboardPage() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/auth/login");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        📊 Dashboard
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <CardButton
          href="/events/create"
          title="➕ Criar Evento"
          description="Cadastre um novo evento na plataforma."
          bg="bg-blue-600"
        />

        <CardButton
          href="/"
          title="📅 Eventos"
          description="Visualize todos os eventos disponíveis."
          bg="bg-indigo-600"
        />

        <CardButton
          href="/my-registrations"
          title="📝 Minhas Inscrições"
          description="Acompanhe o status das suas inscrições."
          bg="bg-purple-600"
        />

        <CardButton
          href="/admin/registrations"
          title="✅ Aprovar Inscrições"
          description="Gerencie inscrições pendentes dos seus eventos."
          bg="bg-green-600"
        />

        <CardButton
          href="/admin/checkin"
          title="🎫 Check-in"
          description="Realize o check-in manual dos participantes."
          bg="bg-orange-600"
        />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white rounded-xl shadow p-6 hover:bg-red-700 transition text-left"
        >
          <h2 className="text-xl font-semibold mb-2">🚪 Sair</h2>
          <p className="text-sm opacity-90">
            Encerrar sessão com segurança.
          </p>
        </button>

      </div>
    </main>
  );
}
