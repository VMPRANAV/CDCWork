import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Forward any request that starts with /api to your backend server
      '/api': {
        target: 'http://localhost:3002', // <-- IMPORTANT: Make sure this is your backend's port
        changeOrigin: true,
      },
    },
  },
})
