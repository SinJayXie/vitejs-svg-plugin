import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({
    insertTypesEntry: true,
    rollupTypes: true,
    outDir: './',
    entryRoot: 'plugins',
    include: ['plugins/**/*']
  })],
  build: {
    rollupOptions: {
      external: ['node:fs', 'node:path', 'os', 'fs/promises', 'path', 'url', 'stream']
    },
    lib: {
      entry: './plugins/index.ts',
      name: 'vitejs-svg-plugin',
      formats: ['es']
    }
  }
})
