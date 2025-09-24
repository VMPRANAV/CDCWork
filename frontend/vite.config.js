import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
