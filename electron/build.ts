import { build } from "esbuild";
import { resolve } from "path";

const isDev = process.env.NODE_ENV === "development";

// Build main process
build({
  entryPoints: [resolve(__dirname, "main.ts")],
  outfile: resolve(__dirname, "../dist/electron/main.js"),
  bundle: true,
  platform: "node",
  target: "node16",
  external: [
    "electron",
    "esbuild",
    "lightningcss",
    "vite",
    // Add any other problematic dependencies here
  ],
  minify: !isDev,
  sourcemap: isDev,
}).catch(() => process.exit(1));

// Build preload script
build({
  entryPoints: [resolve(__dirname, "preload.ts")],
  outfile: resolve(__dirname, "../dist/electron/preload.js"),
  bundle: true,
  platform: "node",
  target: "node16",
  external: [
    "electron",
    "esbuild",
    "lightningcss",
    "vite",
    // Add any other problematic dependencies here
  ],
  minify: !isDev,
  sourcemap: isDev,
}).catch(() => process.exit(1));
