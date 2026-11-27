import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { loadEnvConfig } from "@next/env";
import { getPool } from "../lib/db.js";

const migrationsDirectory = fileURLToPath(new URL("../database/migrations/", import.meta.url));
loadEnvConfig(process.cwd());
let pool;

try {
  pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const migrations = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const name of migrations) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const applied = await client.query(
        "SELECT 1 FROM schema_migrations WHERE name = $1",
        [name],
      );
      if (applied.rowCount) {
        await client.query("COMMIT");
        console.log(`Already applied ${name}`);
        continue;
      }

      const sql = await readFile(new URL(`../database/migrations/${name}`, import.meta.url), "utf8");
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (name) VALUES ($1)",
        [name],
      );
      await client.query("COMMIT");
      console.log(`Applied ${name}`);
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }
} catch (error) {
  console.error("Database migration failed.", error);
  process.exitCode = 1;
} finally {
  if (pool) await pool.end();
}
