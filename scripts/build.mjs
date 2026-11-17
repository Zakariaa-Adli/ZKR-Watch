import * as esbuild from "esbuild";
import { cp, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { createBuildOptions, ROOT } from "./lib/esbuild.config.mjs";
import { renderIndexHtml } from "./lib/html.mjs";

const distDir = path.join(ROOT, "dist");
const publicDir = path.join(ROOT, "public");

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} kB`;
}

await rm(distDir, { recursive: true, force: true });

const startedAt = Date.now();
const result = await esbuild.build(createBuildOptions({ mode: "production" }));

const outputs = Object.entries(result.metafile.outputs);
const mainEntry = outputs.find(([file, info]) => info.entryPoint === "src/main.jsx" && file.endsWith(".js"));

if (!mainEntry) {
  throw new Error("Build produced no JavaScript entry output.");
}

const toPublicUrl = (file) => `/${path.relative(distDir, path.resolve(ROOT, file)).split(path.sep).join("/")}`;

const scripts = [toPublicUrl(mainEntry[0])];
const styles = mainEntry[1].cssBundle ? [toPublicUrl(mainEntry[1].cssBundle)] : [];

// Copy static files, but never overwrite the generated index.html.
await cp(publicDir, distDir, {
  recursive: true,
  force: true,
  filter: (source) => path.basename(source) !== "index.html",
});

await writeFile(path.join(distDir, "index.html"), await renderIndexHtml({ scripts, styles }), "utf8");

const totalBytes = outputs.reduce((sum, [, info]) => sum + info.bytes, 0);

console.log(`\n  Built ZKR Watch in ${Date.now() - startedAt} ms`);
console.log(`  JS        ${scripts.join(", ")}`);
console.log(`  CSS       ${styles.join(", ") || "none"}`);
console.log(`  Output    ${formatSize(totalBytes)} across ${outputs.length} files`);
console.log(`  Directory ${distDir}\n`);
