import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000, // Usa el puerto asignado por Render
    allowedHosts: ['pwa-m875.onrender.com'],
  },
});
