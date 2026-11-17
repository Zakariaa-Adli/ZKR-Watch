import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { renderIndexHtml } from "./html.mjs";
import { ROOT } from "./esbuild.config.mjs";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json; charset=utf-8",
};

function contentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

async function findStaticFile(urlPath, roots) {
  const safePath = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  for (const root of roots) {
    const filePath = path.join(root, safePath);
    if (!filePath.startsWith(root)) continue;
    try {
      const info = await stat(filePath);
      if (info.isFile()) return filePath;
    } catch {
      /* keep looking */
    }
  }
  return null;
}

/**
 * Creates the preview/dev HTTP server.
 * - Serves hashed assets from dist/ and static files from public/
 * - Falls back to index.html for client-side routes
 * - Optionally exposes an SSE endpoint used for live reload
 */
export function createServer({ distDir, dev = false, getHtml }) {
  const publicDir = path.join(ROOT, "public");
  const clients = new Set();

  const server = http.createServer(async (request, response) => {
    const url = new URL(request.url || "/", "http://localhost");
    const pathname = url.pathname;

    if (dev && pathname === "/__events") {
      response.writeHead(200, {
        "content-type": "text/event-stream",
        "cache-control": "no-cache, no-transform",
        connection: "keep-alive",
      });
      response.write("retry: 1000\n\n");
      clients.add(response);
      const heartbeat = setInterval(() => response.write(": ping\n\n"), 20000);
      request.on("close", () => {
        clearInterval(heartbeat);
        clients.delete(response);
      });
      return;
    }

    if (pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }

    // Static assets always win, so deep links like /title/tt123 still get HTML.
    if (pathname.includes(".") || pathname.startsWith("/assets/")) {
      const filePath = await findStaticFile(pathname, [distDir, publicDir]);
      if (filePath) {
        response.writeHead(200, {
          "content-type": contentType(filePath),
          "cache-control": dev ? "no-store" : "public, max-age=3600",
        });
        createReadStream(filePath).pipe(response);
        return;
      }
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("Asset not found");
      return;
    }

    try {
      const html = await getHtml();
      response.writeHead(200, {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      });
      response.end(html);
    } catch (error) {
      response.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
      response.end(`Unable to render index.html\n\n${error.stack || error}`);
    }
  });

  server.broadcastReload = () => {
    for (const client of clients) client.write("data: reload\n\n");
  };

  server.on("close", () => {
    for (const client of clients) client.end();
    clients.clear();
  });

  return server;
}

function listenOn(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off("listening", onListening);
      reject(error);
    };
    const onListening = () => {
      server.off("error", onError);
      resolve();
    };
    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port, "127.0.0.1");
  });
}

function describeListenError(error, port, { fallback = false, maxAttempts = 10 } = {}) {
  if (error.code !== "EADDRINUSE") return error;

  const lastPort = port + maxAttempts;
  const hint = fallback
    ? `Ports ${port}-${lastPort} are all in use. Stop another server, or start with a different port, e.g. PORT=${lastPort + 1} npm run dev.`
    : `Port ${port} is already in use. Stop the other process, or start with a different port, e.g. PORT=${port + 1} npm run dev.`;

  const friendly = new Error(hint);
  friendly.code = error.code;
  return friendly;
}

/**
 * Starts the HTTP server. When `fallback` is enabled, a busy port moves on to
 * the next free one instead of failing — useful when a previous dev server is
 * still running. The actual port is available via `server.address().port`.
 */
export async function startServer({
  port,
  distDir,
  dev = false,
  getHtml,
  fallback = false,
  maxAttempts = 10,
}) {
  const server = createServer({ distDir, dev, getHtml });

  for (let attempt = 0; attempt <= maxAttempts; attempt += 1) {
    const candidate = port + attempt;
    try {
      await listenOn(server, candidate);
      return server;
    } catch (error) {
      if (error.code !== "EADDRINUSE") throw error;
      if (!fallback || attempt === maxAttempts) {
        throw describeListenError(error, port, { fallback, maxAttempts });
      }
    }
  }

  throw describeListenError({ code: "EADDRINUSE" }, port, { fallback, maxAttempts });
}

// Convenience for scripts that want the default HTML renderer in dev.
export async function devHtml() {
  return renderIndexHtml({
    dev: true,
    styles: ["/assets/main.css"],
    scripts: ["/assets/main.js"],
  });
}
