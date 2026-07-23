// Regenerates src/db/migrations.generated.ts from the .sql files in
// src/db/migrations. The embedded copy is what runs at runtime — the .sql
// files are the readable/PostgreSQL-reference source. Run after editing SQL:
//   node scripts/build-migrations.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "src", "db", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const entries = files.map((name) => {
  const sql = readFileSync(join(dir, name), "utf8");
  if (sql.includes("`") || sql.includes("${")) {
    throw new Error(`Migration ${name} contains a backtick or template expression; cannot embed safely.`);
  }
  return `  {\n    name: ${JSON.stringify(name)},\n    sql: \`${sql}\`,\n  },`;
});

const out = `// AUTO-GENERATED from src/db/migrations/*.sql — do not edit by hand.
// Regenerate with: node scripts/build-migrations.mjs
// Embedded so the SQL is bundled into the serverless build (no runtime fs read
// of source files, which do not exist in the Next.js production output).

export interface Migration { name: string; sql: string; }

export const MIGRATIONS: Migration[] = [
${entries.join("\n")}
];
`;

writeFileSync(join(dir, "..", "migrations.generated.ts"), out);
console.log(`Embedded ${files.length} migration(s): ${files.join(", ")}`);
