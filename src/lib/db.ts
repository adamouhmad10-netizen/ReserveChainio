import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { seed } from "@/db/seed";
import { MIGRATIONS } from "@/db/migrations.generated";

let db: Database.Database | null = null;

// Resolves a writable database path.
// - Local / persistent-server hosts: RC_SQLITE_PATH (default ./data/…), which
//   persists across requests and restarts.
// - Serverless (Vercel, etc.): the project filesystem is read-only except the
//   OS temp dir, so fall back there. NOTE: /tmp is per-instance and ephemeral —
//   the database reseeds on each cold start and does NOT persist. For durable
//   data on serverless, point DATABASE_URL at PostgreSQL/Supabase (the
//   documented production target — see docs/database-schema.md).
function resolveDbPath(): string {
  const explicit = process.env.RC_SQLITE_PATH;
  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (isServerless && (!explicit || !path.isAbsolute(explicit))) {
    return path.join("/tmp", "reservechain.db");
  }
  const rel = explicit ?? "./data/reservechain.db";
  return path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
}

export function getDb(): Database.Database {
  if (db) return db;
  const file = resolveDbPath();
  fs.mkdirSync(path.dirname(file), { recursive: true });
  db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  seed(db);
  return db;
}

function migrate(d: Database.Database) {
  d.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL DEFAULT (datetime('now')))`
  );
  const applied = new Set(
    (d.prepare("SELECT name FROM _migrations").all() as { name: string }[]).map((r) => r.name)
  );
  // Migrations are embedded (see src/db/migrations.generated.ts) so they are
  // bundled into the serverless output rather than read from source at runtime.
  for (const m of MIGRATIONS) {
    if (applied.has(m.name)) continue;
    d.exec(m.sql);
    d.prepare("INSERT INTO _migrations (name) VALUES (?)").run(m.name);
  }
}

export function newId(): string {
  return randomUUID();
}
