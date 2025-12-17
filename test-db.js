import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: "localhost",
  port: 5433, // 👈 coloque a porta correta
  user: "postgres",
  password: "123abc", // 👈 senha que você acabou de definir
  database: "eventsync",
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("✅ Conectado com sucesso:", res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error("❌ ERRO DE CONEXÃO:", err.message);
    process.exit(1);
  }
})();
