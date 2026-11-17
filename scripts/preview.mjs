import path from "node:path";
import { ROOT } from "./lib/esbuild.config.mjs";
import { startServer } from "./lib/server.mjs";
import { renderIndexHtml } from "./lib/html.mjs";

const requestedPort = Number(process.env.PORT || 4000);
const distDir = path.join(ROOT, "dist");

// Read the generated production HTML once; preview is intentionally read-only.
const { readFile } = await import("node:fs/promises");
let html;
try {
  html = await readFile(path.join(distDir, "index.html"), "utf8");
} catch {
  console.error("No production build found. Run `npm run build` first.");
  process.exit(1);
}

const server = await startServer({
  port: requestedPort,
  distDir,
  getHtml: async () => html,
  fallback: true,
});

const port = server.address().port;
if (port !== requestedPort) {
  console.log(`\n  Port ${requestedPort} was busy — using ${port} instead.`);
}
console.log(`\n  Previewing production build at http://localhost:${port}\n`);

const shutdown = () => server.close(() => process.exit(0));
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
