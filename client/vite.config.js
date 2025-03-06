import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig(
  ({ command }) => {
  // Use root path in development and /static/ in production
  const basePath = command === 'serve' ? '/' : '/static/'
  return {
    plugins: [react(),tailwindcss()],
    base: basePath,
  }
})
