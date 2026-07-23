import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import { seed } from "@/db/seed";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const rel = process.env.RC_SQLITE_PATH ?? "./data/reservechain.db";
  const file = path.isAbsolute(rel) ? rel : path.join(process.cwd(), rel);
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
  const dir = path.join(process.cwd(), "src", "db", "migrations");
  const applied = new Set(
    (d.prepare("SELECT name FROM _migrations").all() as { name: string }[]).map((r) => r.name)
  );
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    if (applied.has(f)) continue;
    d.exec(fs.readFileSync(path.join(dir, f), "utf8"));
    d.prepare("INSERT INTO _migrations (name) VALUES (?)").run(f);
  }
}

export function newId(): string {
  return crypto.randomUUID();
}
