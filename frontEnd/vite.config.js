import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  base: '/',
  server: {
    proxy: {
      // Forwards all /api requests to your Python backend
      '/api': {
        target: 'https://remopdf-backend.onrender.com/api', // <-- Change 8000 if your Python server uses a different port (like 5000)
        changeOrigin: true,
        secure: false,
      }
    }
  }
})