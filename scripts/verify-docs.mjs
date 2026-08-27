import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignored = new Set([".git", ".next", ".terraform", ".venv", "dist", "node_modules", "out"]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const markdownFiles = walk(root).filter((file) => extname(file) === ".md");
const failures = [];

for (const file of markdownFiles) {
  const content = readFileSync(file, "utf8");
  const links = content.matchAll(/\[[^\]]*\]\(([^)]+)\)/g);
  for (const match of links) {
    const raw = match[1].trim().replace(/^<|>$/g, "");
    if (/^(?:https?:|mailto:|#)/.test(raw)) continue;
    const target = decodeURIComponent(raw.split("#", 1)[0].split("?", 1)[0]);
    if (!target) continue;
    const absolute = resolve(dirname(file), target);
    if (!existsSync(absolute)) failures.push(`${file.slice(root.length + 1)} -> ${raw}`);
    else if (statSync(absolute).isDirectory() && !existsSync(resolve(absolute, "README.md"))) {
      failures.push(`${file.slice(root.length + 1)} -> ${raw} (directory has no README.md)`);
    }
  }
}

if (failures.length) {
  console.error(`Broken relative documentation links (${failures.length}):\n${failures.join("\n")}`);
  process.exit(1);
}

console.log(`Documentation check passed: ${markdownFiles.length} Markdown files.`);
