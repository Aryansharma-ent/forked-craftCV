import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function copyIndexTo404() {
  return {
    name: 'copy-index-to-404',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist')
      const indexFile = path.resolve(distDir, 'index.html')
      const notFoundFile = path.resolve(distDir, '404.html')
      const noJekyllFile = path.resolve(distDir, '.nojekyll')
      if (fs.existsSync(indexFile)) {
        fs.copyFileSync(indexFile, notFoundFile)
      }
      fs.writeFileSync(noJekyllFile, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES ? '/CraftCV/' : '/'),
  plugins: [
    react(),
    tailwindcss(),
    copyIndexTo404(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

