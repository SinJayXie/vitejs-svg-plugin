import * as path from 'node:path'
import * as fs from 'node:fs'
import { optimize } from 'svgo'
import type { Plugin } from 'vite'
import { getTemplate, getTemplateText } from './template.js'

export interface SvgLoaderPluginOptions {
    path: string,
    prefix?: string,
    output?: string,
    css?: boolean
}

export interface SvgLoaderPluginApi {
    name: string
}

const getCss = function(icons: Map<string, string>, prefix: string) {
  const css: string[] = []
  icons.forEach((icon, key) => {
    css.push(`.${prefix}-${key}{--SVG-ICON:url('${icon}');-webkit-mask:var(--SVG-ICON) no-repeat;mask:var(--SVG-ICON) no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;background-color:currentColor;color:inherit;}`)
  })
  return css.join('\n')
}

const getAllSvgAssets = function(filePath: string, prefix: string, css?: boolean): Map<string, string> {
  const map = new Map<string, string>()
  if (fs.existsSync(filePath)) {
    fs.readdirSync(filePath).filter(file => file.endsWith('.svg')).forEach(file => {
      const basename = path.basename(file, '.svg')
      const svg = optimize(fs.readFileSync(path.resolve(filePath, file)).toString(), {
        ...(css ? { datauri: 'enc' } : {}),
        plugins: [
          'removeEmptyAttrs',
          {
            name: 'removeAttrs',
            params: {
              attrs: ['width', 'height']
            }
          },
          {
            name: 'addAttributesToSVGElement',
            params: {
              attribute: { fill: 'currentColor', id: `${prefix}_${basename}` }
            }
          }
        ]
      })
      const finalSvg = css
        ? svg.data // css 模式直接用 dataURI
        : svg.data.replace('<svg', '<symbol').replace('</svg>', '</symbol>')
      map.set(basename, finalSvg)
    })
  }
  return map
}

export const SvgLoaderPlugin = function(option: SvgLoaderPluginOptions): Plugin<SvgLoaderPluginApi> {
  const options: SvgLoaderPluginOptions = Object.assign({
    path: '',
    prefix: 'icon',
    css: false,
    output: null
  }, option)

  const svgMap = getAllSvgAssets(path.resolve(process.cwd(), options.path), options.prefix!, option.css)
  const virtualModuleId = 'virtual:svg-loader' + (options.css ? '.css' : '')
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const entryTest = /src\/main.(js|ts)$/

  return {
    name: 'SvgLoaderPlugin',
    outputOptions(output) {
      output.manualChunks = id => {
        if (id === resolvedVirtualModuleId) return 'svg-icons'
      }
      return output
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const svgRecord: Array<string> = []
        svgMap.forEach((svg) => {
          svgRecord.push(svg)
        })
        if (option.output) {
          const icons = Array.from(svgMap.keys()).map(item => `'${item}'`)
          const result = getTemplateText().replace('#ICON_LIST#', icons.join(' | ') + ' | string')
            .replace('#date#', new Date().toLocaleString('en-US'))
            .replace('#amount#', String(icons.length))
          fs.writeFile(option.output, result, (err) => {
            if (err) {
              console.error(err)
            } else {
              console.log(`Write ${option.output} success`)
            }
          })
        }
        return !options.css ? getTemplate().replace('[#SVG_DATA#]', JSON.stringify(svgRecord)) : getCss(svgMap, options.prefix!)
      }
    },
    transform(code, id) {
      if (entryTest.test(id)) {
        return `import '${virtualModuleId}';\n${code}`
      }
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    }
  }
}
