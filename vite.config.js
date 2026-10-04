import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// arincicek.info is a custom domain, so Pages serves this site from /, not /arincicek/.
export default defineConfig({
  plugins: [tailwindcss()],
  base: '/',
})
