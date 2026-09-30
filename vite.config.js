import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Local preview stays at /. GitHub project Pages serves the repo from /arincicek/.
export default defineConfig({
  plugins: [tailwindcss()],
  base: process.env.GITHUB_ACTIONS ? '/arincicek/' : '/',
})
