import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['icon-180.png', 'icon-192.png', 'icon-512.png'],
    manifest: {
      id: '/',
      name: 'Noah Hova — Ideas in Motion',
      short_name: 'Noah Hova',
      description: 'Ideas in motion from Noah Hova.',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      background_color: '#101b19',
      theme_color: '#101b19',
      icons: [
        { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    workbox: { globPatterns: ['**/*.{html,js,css,jpg,png,svg,webp}'] },
  })],
})
