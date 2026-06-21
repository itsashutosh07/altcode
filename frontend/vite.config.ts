import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'

/**
 * GitHub Pages:
 * - Project site: https://owner.github.io/repo/ → base /repo/
 * - User/org site (repo name *.github.io): root → base /
 * Local dev: GITHUB_REPOSITORY unset → base /
 */
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const isUserOrOrgPagesSite = Boolean(repo?.endsWith('.github.io'))
const base =
  repo && !isUserOrOrgPagesSite ? `/${repo}/` : '/'

// https://vitejs.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    /**
     * Emits `.br` next to text assets (js, css, html, svg, …) in `dist/`.
     * The host must serve them with `Content-Encoding: br` (e.g. nginx
     * `brotli_static`, Caddy `encode`, or a CDN). GitHub Pages compresses at
     * the edge but does not map these sidecar files; use Cloudflare in front
     * or another origin that supports precompressed static files.
     */
    compression({
      algorithms: ['brotliCompress'],
      threshold: 1024,
      skipIfLargerOrEqual: true,
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
