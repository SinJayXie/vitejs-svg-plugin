# vitejs-svg-plugin

[![npm version](https://img.shields.io/npm/v/vitejs-svg-plugin.svg)](https://www.npmjs.com/package/vitejs-svg-plugin)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Vite plugin that automatically loads, optimizes, and registers SVG files as inline symbols for efficient usage in your projects.

## Features

- ✅ Automatically scans and loads SVG files from specified directories
- ✅ Optimizes SVGs using SVGO for smaller file sizes
- ✅ Supports configurable ID prefix for SVG symbols
- ✅ Automatically sets `fill="currentColor"` for consistent styling
- ✅ Removes width/height attributes for flexible sizing
- ✅ Registers SVGs as inline symbols in the DOM for efficient rendering
- ✅ Generates TypeScript type definitions for SVG icon names
- ✅ Supports manual chunking for better code splitting
- ✅ Works seamlessly with Vite 3, 4, 5, and 6+

## Installation

```bash
npm install vitejs-svg-plugin --save-dev
```

Or using pnpm:

```bash
pnpm add -D vitejs-svg-plugin
```

## Usage

### Basic Configuration

Add the plugin to your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import { createSvgLoader } from 'vitejs-svg-plugin'

export default defineConfig({
  plugins: [
    createSvgLoader({
      path: 'src/assets/svg'
    })
  ]
})
```

### Advanced Configuration

```typescript
import { defineConfig } from 'vite'
import { createSvgLoader } from 'vitejs-svg-plugin'

export default defineConfig({
  plugins: [
    createSvgLoader({
      path: 'src/assets/svg',
      prefix: 'icon', // Default: 'icon'
      output: 'src/types/svg-icons.d.ts'
    })
  ]
})
```

### Usage in Components

The plugin automatically injects the SVG loader into your entry file (`src/main.js` or `src/main.ts`). You can use SVG icons in your components:

```vue
<template>
  <svg class="icon">
    <use :xlink:href="'#icon_home'" />
  </svg>
</template>

Or in React:

```tsx
const Icon = ({ name }: { name: string }) => (
  <svg className="icon">
    <use xlinkHref={`#icon_${name}`} />
  </svg>
)
```

## Configuration Options

### `path` (required)

Type: `string`

The directory path where your SVG files are located. The plugin will recursively scan this directory for `.svg` files.

```typescript
path: 'src/assets/icons'
```

### `prefix` (optional)

Type: `string`  
Default: `'icon'`

The prefix to use for SVG symbol IDs. This helps avoid ID conflicts when multiple SVG plugins are used.

```typescript
prefix: 'my-icon' // Results in IDs like: my-icon_home, my-icon_user
```

### `output` (optional)

Type: `string`

Path to generate a TypeScript file containing icon names. This enables type-safe icon usage.

```typescript
output: 'src/types/svg-icons.d.ts'
```

Generated file example:

```typescript
/**
 * Svg Icon names (vitejs-svg-plugin)
 * @author SinJay Xie
 * @date Mon Mar 03 2026
 * @description Load SVG amount: 3
 */
export type SvgIconNames = 'home' | 'user' | 'settings' | string;
```

## How It Works

1. **Scan**: The plugin scans the specified directory for all `.svg` files
2. **Optimize**: Each SVG is optimized using SVGO with plugins:
   - `removeEmptyAttrs`: Removes empty attributes
   - `removeAttrs`: Removes width and height attributes for flexible sizing
   - `addAttributesToSVGElement`: Adds `fill="currentColor"` and configurable ID prefix
3. **Convert**: SVG elements are converted to `<symbol>` elements
4. **Register**: Symbols are injected into the DOM as a hidden SVG container
5. **Use**: You can reference any SVG using `<use xlink:href="#prefix_name" />`

## Example Project Structure

```
src/
├── assets/
│   └── svg/
│       ├── home.svg
│       ├── user.svg
│       └── settings.svg
├── components/
│   └── Icon.vue
└── main.ts
```

## TypeScript Support

When using the `output` option, the plugin generates type definitions that allow you to:

- Get autocomplete for icon names
- Catch typos at compile time
- Refactor icon names safely
- Use the generated `SvgIconNames` type for type-safe icon usage

Example with TypeScript:

```typescript
import type { SvgIconNames } from '@/types/svg-icons'

// Type-safe icon usage
const icon: SvgIconNames = 'home'
```

## License

MIT © [sinjayxie](https://github.com/sinjayxie)