import { readFile } from "node:fs/promises";
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ?? process.env.db_DATABASE_URL;

if (!connectionString) {
  console.error("Missing DATABASE_URL. Run `vercel env pull .env.local` first.");
  process.exit(1);
}

const sql = neon(connectionString);
const seed = await readFile(new URL("../db/seed.sql", import.meta.url), "utf8");

const inserted = await sql.query(seed);
const [{ count }] = await sql`SELECT count(*)::int AS count FROM meetings`;

console.log(`Inserted ${inserted.length} meetings (${count} total).`);
