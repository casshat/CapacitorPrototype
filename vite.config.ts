import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Required for Capacitor - ensures assets load correctly in native app
  base: './',
  
  build: {
    // Output directory that Capacitor will use
    outDir: 'dist',
    
    // Ensure assets are inlined or use relative paths
    assetsInlineLimit: 0,
  },
  
  server: {
    // Allow connections from Capacitor live reload
    host: true,
  },
})
