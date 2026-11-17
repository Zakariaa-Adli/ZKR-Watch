import * as esbuild from "esbuild";
import path from "node:path";
import { createBuildOptions, ROOT } from "./lib/esbuild.config.mjs";
import { devHtml, startServer } from "./lib/server.mjs";

const requestedPort = Number(process.env.PORT || 3000);
// Keep dev output separate from dist/ so `npm run build` never wipes the
// files the running dev server is serving.
const devDir = path.join(ROOT, ".dev");

let server;

const context = await esbuild.context(
  createBuildOptions({
    mode: "development",
    outdir: devDir,
    onRebuild: (result) => {
      if (result.errors.length > 0) return;
      server?.broadcastReload();
    },
  }),
);

await context.rebuild();
await context.watch();

server = await startServer({
  port: requestedPort,
  distDir: devDir,
  dev: true,
  getHtml: devHtml,
  fallback: true,
});

const port = server.address().port;
if (port !== requestedPort) {
  console.log(`\n  Port ${requestedPort} was busy — using ${port} instead.`);
}
console.log(`\n  ZKR Watch is running at http://localhost:${port}\n`);

const shutdown = async () => {
  await context.dispose();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
