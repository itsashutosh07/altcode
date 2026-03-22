import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
})
