import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 5432,
  database: "eventsync",
  user: "postgres",
  password: "35Pcpv11@#",
});

try {
  const res = await pool.query("SELECT NOW()");
  console.log("Conectado:", res.rows[0]);
  process.exit(0);
} catch (e) {
  console.error("Erro de conexão:", e);
  process.exit(1);
}
