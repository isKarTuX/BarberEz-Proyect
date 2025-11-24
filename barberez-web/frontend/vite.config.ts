import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Descomentar la siguiente línea si despliegas en GitHub Pages
  // base: '/BarberEz-Proyect/',
  server: {
    port: 5173,
    host: true
  }
})
