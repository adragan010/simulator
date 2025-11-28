import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/simulator/', // REQUIRED for GitHub Pages
  build: {
    outDir: 'docs', // THIS makes GitHub Pages pick up your build
  },
})
