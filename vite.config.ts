import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { createSvgLoader } from './plugins/index.js'
import path from 'path'

const isDev = process.env.NODE_ENV === 'development'
// createSvgLoader
export default defineConfig({
  plugins: [!isDev ? dts({
    insertTypesEntry: true,
    rollupTypes: true,
    outDir: './',
    entryRoot: 'plugins',
    include: ['plugins/**/*']
  }) : createSvgLoader({
    path: path.resolve(__dirname, './example/svg/icons'),
    prefix: 'icon',
    output: path.resolve(__dirname, './example/svg/svg.d.ts')
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
