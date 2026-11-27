import pg from "pg";

const { Pool } = pg;
const globalForDatabase = globalThis;

export function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be configured before using job data.");
  }

  if (!globalForDatabase.oracrestPool) {
    const parsedMax = Number.parseInt(process.env.DB_POOL_MAX || "10", 10);
    globalForDatabase.oracrestPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number.isInteger(parsedMax) ? Math.min(Math.max(parsedMax, 1), 50) : 10,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });
    globalForDatabase.oracrestPool.on("error", (error) => {
      console.error("Unexpected PostgreSQL pool error.", error);
    });
  }

  return globalForDatabase.oracrestPool;
}
