import { readFile } from "node:fs/promises";
import path from "node:path";
import { ROOT } from "./esbuild.config.mjs";

const TEMPLATE_PATH = path.join(ROOT, "public", "index.html");

/**
 * Injects the built asset tags into the HTML template. Keeping the template in
 * public/ means metadata, fonts and social tags stay easy to edit.
 */
export async function renderIndexHtml({ scripts = [], styles = [], dev = false } = {}) {
  const template = await readFile(TEMPLATE_PATH, "utf8");

  const styleTags = styles
    .map((href) => `<link rel="stylesheet" href="${href}" />`)
    .join("\n    ");

  const scriptTags = scripts
    .map((src) => `<script type="module" src="${src}"></script>`)
    .join("\n    ");

  // The dev reload hook is intentionally tiny — the dev server broadcasts a
  // message on every successful esbuild rebuild.
  const devScript = dev
    ? `<script>
      (() => {
        const source = new EventSource("/__events");
        source.addEventListener("reload", () => window.location.reload());
        source.addEventListener("error", () => source.close());
      })();
    </script>`
    : "";

  return template
    .replace("<!--app-css-->", styleTags)
    .replace("<!--app-js-->", [scriptTags, devScript].filter(Boolean).join("\n    "));
}
