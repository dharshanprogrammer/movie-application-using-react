import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    sourcemapIgnoreList() { return true } // suppress map lookups in dev
  },
  build: {
    sourcemap: false // prevent .map files on build
  }
})
