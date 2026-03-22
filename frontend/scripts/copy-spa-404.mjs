import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const indexHtml = join(dist, "index.html");
const notFoundHtml = join(dist, "404.html");

if (!existsSync(indexHtml)) {
  console.error("copy-spa-404: dist/index.html missing — run vite build first.");
  process.exit(1);
}
copyFileSync(indexHtml, notFoundHtml);
console.log("copy-spa-404: wrote dist/404.html (GitHub Pages client-routing fallback).");
