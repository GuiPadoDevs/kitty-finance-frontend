import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.svg', 'icons/*.png'],
      manifest: {
        name: 'Finanças da Sah 🎀',
        short_name: 'Finanças Sah',
        description: 'Organizador financeiro personalizado Hello Kitty para a Sah',
        theme_color: '#FF85A2',
        background_color: '#FFF0F5',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}']
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname || process.cwd(), './src')
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
