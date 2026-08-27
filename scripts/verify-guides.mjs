import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const guideDirectory = resolve("apps/web/public/guides");
const topicPages = [
  "01-financial-transaction.html",
  "02-cloud-architecture.html",
  "03-ai-delivery.html",
  "04-presales-delivery.html",
  "05-engineering-evidence.html",
];
const pages = ["index.html", ...topicPages];
const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function localTarget(pagePath, reference) {
  const pathOnly = reference.split(/[?#]/, 1)[0];
  if (!pathOnly || /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i.test(reference)) return null;
  return resolve(dirname(pagePath), pathOnly);
}

for (const file of pages) {
  const pagePath = join(guideDirectory, file);
  check(existsSync(pagePath), `${file}: file is missing`);
  if (!existsSync(pagePath)) continue;

  const html = readFileSync(pagePath, "utf8");
  check(/^<!doctype html>/i.test(html), `${file}: missing HTML5 doctype`);
  check(/<html\s+lang="zh-CN">/i.test(html), `${file}: missing Chinese language declaration`);
  check(/<meta\s+name="viewport"/i.test(html), `${file}: missing responsive viewport`);
  check(/<title>[^<]+<\/title>/i.test(html), `${file}: missing document title`);
  check(/<h1>[^<]+<\/h1>/i.test(html), `${file}: missing primary heading`);
  check(/href="\.\/guide\.css"/.test(html), `${file}: shared stylesheet is not linked`);
  check(/src="\.\/guide\.js"/.test(html), `${file}: shared behavior script is not linked`);
  check(!/(?:href|src)="\/(?!\/)/.test(html), `${file}: root-relative asset breaks GitHub Pages subpaths`);

  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  check(duplicateIds.length === 0, `${file}: duplicate ids: ${[...new Set(duplicateIds)].join(", ")}`);

  for (const match of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    const target = localTarget(pagePath, reference);
    if (!target) continue;
    check(existsSync(target), `${file}: broken local reference ${reference}`);
    if (existsSync(target) && extname(target) === "" && !statSync(target).isDirectory()) {
      errors.push(`${file}: local route is neither a file nor a directory: ${reference}`);
    }
  }

  if (file !== "index.html") {
    check(/id="interview-script"/.test(html), `${file}: missing interview script`);
    check(/data-practice/.test(html), `${file}: missing practice checklist`);
    for (const topic of topicPages) {
      check(html.includes(`href="./${topic}"`), `${file}: topic navigation is missing ${topic}`);
    }
  }
}

const indexHtml = readFileSync(join(guideDirectory, "index.html"), "utf8");
for (const topic of topicPages) {
  check(indexHtml.includes(`href="./${topic}"`), `index.html: directory is missing ${topic}`);
}

if (errors.length > 0) {
  console.error(`Guide verification failed with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Guide verification passed: ${topicPages.length} topic pages + 1 directory, all local links resolved.`);
