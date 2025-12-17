import Image from "next/image";
import { headers } from "next/headers";

async function getQR(registrationId: string) {
  const headersList = await headers(); // ✅ AQUI ESTÁ A CORREÇÃO
  const host = headersList.get("host");

  if (!host) {
    return null;
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/qrcode?id=${registrationId}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function Ticket({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const qr = await getQR(id);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          🎟️ Ingresso #{id}
        </h1>

        {qr?.qrCode ? (
          <Image
            src={qr.qrCode}
            alt="QR Code do ingresso"
            width={250}
            height={250}
            className="mx-auto"
          />
        ) : (
          <p className="text-red-500">
            QR Code não disponível
          </p>
        )}
      </div>
    </main>
  );
}