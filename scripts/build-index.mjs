// build-index.mjs — genera publishers.json (la vista humana de la landing)
// desde los MISMOS conceptos OKF que consumen los agentes. Determinista:
// ordenado por archivo; regenerar tras tocar knowledge/publishers/.
// Uso: node scripts/build-index.mjs [--check]
import { readFileSync, readdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_DIR = join(ROOT, "knowledge", "publishers");
const OUT = join(ROOT, "publishers.json");

function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const fm = {};
  if (!m) return fm;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_-]*)\s*:\s*(.*)$/);
    if (kv) fm[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fm;
}

const publishers = [];
for (const file of readdirSync(PUB_DIR).sort()) {
  if (!file.endsWith(".md")) continue;
  const raw = readFileSync(join(PUB_DIR, file), "utf8").replace(/\r\n/g, "\n");
  const fm = frontmatter(raw);
  const consume = (raw.match(/```\n([\s\S]*?)```/) || [])[1] || "";
  publishers.push({
    id: "publishers/" + file,
    title: fm.title || file,
    description: fm.description || "",
    origin: fm.origin || null,
    verify: fm.verify || "none",
    timestamp: fm.timestamp || null,
    consume: consume.trim().split("\n").filter((l) => l.trim() && !l.trim().startsWith("#")),
  });
}

const content = JSON.stringify({ generated_from: "knowledge/publishers/", count: publishers.length, publishers }, null, 2) + "\n";

if (process.argv.includes("--check")) {
  const current = existsSync(OUT) ? readFileSync(OUT, "utf8").replace(/\r\n/g, "\n") : null;
  if (current !== content) {
    console.error("[DRIFT] publishers.json desactualizado. Corre: node scripts/build-index.mjs");
    process.exit(1);
  }
  console.log("[OK] publishers.json en sync (" + publishers.length + " publicadores)");
} else {
  writeFileSync(OUT, content, "utf8");
  console.log("publishers.json: " + publishers.length + " publicadores");
}
