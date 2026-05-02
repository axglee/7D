import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { readFileSync, writeFileSync } from 'fs'
import path from 'path'

const META = `/**
 * @name 7DE
 * @description 7TV emotes in Discord
 * @version 1.2.0
 * @author axglee
 * @source https://github.com/axglee/7DE
 */`

export default defineConfig({
  plugins: [
    svelte({ compilerOptions: { css: 'injected' } }),
    {
      name: 'bd-meta',
      closeBundle() {
        const file = path.resolve('dist-bd/7DE.plugin.js')
        let content = readFileSync(file, 'utf-8')
        content = content + '\nmodule.exports = SevenDEPlugin;'
        writeFileSync(file, META + '\n' + content)
      },
    }
  ],
  build: {
    outDir: 'dist-bd',
    copyPublicDir: false,
    target: 'es2015',
    lib: {
      entry: 'src/bd-entry.ts',
      name: 'SevenDEPlugin',
      formats: ['iife'],
      fileName: () => '7DE.plugin.js'
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      }
    },
    cssCodeSplit: false,
    minify: false,
  }
})