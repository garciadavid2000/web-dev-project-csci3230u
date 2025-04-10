import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',  // Ensures Vite is accessible inside Docker
    port: 5173,       // Explicitly set the port
    proxy: {
      '/api': {
        target: 'http://backend:3000',  // Use backend service name in Docker
        changeOrigin: true,
        secure: false,
      },
    },
  },
});