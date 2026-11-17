import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

/**
 * Shared esbuild configuration for the dev server and production build.
 * React 19's automatic JSX runtime keeps component files free of React imports.
 */
export function createBuildOptions({ mode = "production", onRebuild, outdir } = {}) {
  const isDev = mode === "development";

  return {
    absWorkingDir: ROOT,
    entryPoints: [path.join(ROOT, "src", "main.jsx")],
    outdir: outdir || path.join(ROOT, "dist"),
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    target: ["es2020", "chrome100", "firefox100", "safari15"],
    jsx: "automatic",
    minify: !isDev,
    sourcemap: isDev ? "inline" : false,
    metafile: true,
    logLevel: "warning",
    legalComments: "none",
    entryNames: isDev ? "assets/[name]" : "assets/[name]-[hash]",
    chunkNames: "assets/chunks/[name]-[hash]",
    assetNames: "assets/media/[name]-[hash]",
    loader: {
      ".svg": "file",
      ".png": "file",
      ".jpg": "file",
      ".jpeg": "file",
      ".webp": "file",
      ".woff2": "file",
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(isDev ? "development" : "production"),
    },
    plugins: onRebuild
      ? [
          {
            name: "rebuild-notifier",
            setup(build) {
              build.onEnd((result) => onRebuild(result));
            },
          },
        ]
      : [],
  };
}

export { ROOT };
