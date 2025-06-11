import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/app',

  build: { 
    outDir: '/home/kim/Documents/Projects/fastapi/app/',
    emptyOutDir: true, 
  }
})
