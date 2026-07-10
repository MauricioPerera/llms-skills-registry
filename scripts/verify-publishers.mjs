// verify-publishers.mjs — el registro no confía ni en sus propias entradas.
//
// Para cada concepto de knowledge/publishers/ con frontmatter `origin` y
// `verify: root|project`, comprueba EN VIVO que el publicador sigue sirviendo
// lo que declara:
//   1. GET <origin>/llms.txt -> 200 y contiene una seccion ## Skills con al
//      menos una skill ejecutable (tool + tool_sha256).
//   2. Cada tool.js declarada se descarga y su sha256 (CRLF->LF normalizado)
//      coincide con el tool_sha256 declarado por el propio publicador.
//
// `verify: project` resuelve los paths root-relativos contra el DIRECTORIO de
// la pagina (semantica de `--serve`), porque en project pages el origin del
// navegador colapsa el path. `verify: none` (o ausencia de origin) se salta.
//
// Uso: node scripts/verify-publishers.mjs   (exit 1 si algo no verifica)

import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_DIR = join(ROOT, "knowledge", "publishers");

const SKILL_RE = /^\s*-\s+\[[^\]]+\]\([^)]*\):.*<!--\s*skill:\s*(\{.*?\})\s*-->\s*$/;

const sha256Normalized = (text) =>
  createHash("sha256").update(text.replace(/\r\n/g, "\n"), "utf8").digest("hex");

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

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status} en ${url}`);
  return res.text();
}

let failures = 0;
const ok = (msg) => console.log("  PASS " + msg);
const fail = (msg) => { console.log("  FAIL " + msg); failures++; };

for (const file of readdirSync(PUB_DIR).sort()) {
  if (!file.endsWith(".md")) continue;
  const fm = frontmatter(readFileSync(join(PUB_DIR, file), "utf8"));
  if (!fm.origin || !fm.verify || fm.verify === "none") {
    console.log(`- ${file}: sin verificacion en vivo (verify=${fm.verify || "none"})`);
    continue;
  }
  const base = fm.origin.replace(/\/$/, "");
  console.log(`- ${file} -> ${base} (${fm.verify})`);
  try {
    const llms = await fetchText(base + "/llms.txt");
    const skills = [];
    for (const line of llms.split(/\r?\n/)) {
      const m = line.match(SKILL_RE);
      if (!m) continue;
      try {
        const meta = JSON.parse(m[1]);
        if (typeof meta.tool === "string" && typeof meta.tool_sha256 === "string") skills.push(meta);
      } catch { /* JSON invalido: la validacion del publicador es problema del publicador */ }
    }
    if (skills.length === 0) { fail("llms.txt sin skills ejecutables"); continue; }
    ok(`llms.txt vivo con ${skills.length} skill(s) ejecutable(s)`);

    for (const s of skills) {
      // root: paths contra el origin. project: paths root-relativos contra el
      // directorio de la pagina (como los sirve --serve / el propio Pages path).
      const toolUrl = s.tool.startsWith("http")
        ? s.tool
        : fm.verify === "project" && s.tool.startsWith("/")
          ? base + s.tool
          : new URL(s.tool, base + "/").toString();
      const code = await fetchText(toolUrl);
      const actual = sha256Normalized(code);
      if (actual === s.tool_sha256) ok(`tool verificada: ${s.tool} (${actual.slice(0, 12)}...)`);
      else fail(`tool_sha256 MISMATCH en ${toolUrl}: declarado ${s.tool_sha256.slice(0, 12)}..., real ${actual.slice(0, 12)}...`);
    }
  } catch (e) {
    fail(String(e.message || e));
  }
}

console.log(failures === 0 ? "\nREGISTRO VERIFICADO: todos los publicadores vivos y honestos" : `\n${failures} verificacion(es) fallida(s)`);
process.exit(failures ? 1 : 0);
