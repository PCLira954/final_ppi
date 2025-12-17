import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
          <Link href="/">Home</Link> |{" "}
          <Link href="/">Eventos</Link> |{" "}
          <Link href="/dashboard">Dashboard</Link> |{" "}
          <Link href="/auth/login">Login</Link>
        </nav>

        {children}
      </body>
    </html>
  );
}