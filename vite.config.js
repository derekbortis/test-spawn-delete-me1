import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  base: './',
  server: { host: true },
  plugins: [viteSingleFile()],
  build: {
    // Inline everything so the build output is a single self-contained HTML
    // file you can double-click to open from the filesystem.
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})
