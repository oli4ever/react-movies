import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/", // Keep as root for Vercel
  server: {
    proxy: {
      '/tmdb-api': {  // Changed from '/api' to avoid conflicts
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tmdb-api/, ''),
        headers: {
          Authorization: `Bearer ${process.env.VITE_TMDB_API_KEY}`
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
})