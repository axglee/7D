import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

export default defineConfig(({ mode }) => ({
  plugins: [svelte()],
  build: {
    emptyOutDir: false,
    rollupOptions: {
      input: mode === 'content'
        ? resolve(__dirname, 'src/main.ts')
        : resolve(__dirname, 'popup.html'),
      output: {
        entryFileNames: '[name].js',
        format: mode === 'content' ? 'iife' : 'es',
      }
    },
    outDir: 'dist',
  },
  publicDir: 'public'
}))