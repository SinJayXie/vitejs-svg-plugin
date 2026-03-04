import { SvgLoaderPlugin, type SvgLoaderPluginOptions } from './SvgLoaderPlugin.js'

const createSvgLoader = function(opt: SvgLoaderPluginOptions) {
  return SvgLoaderPlugin(opt)
}

export {
  SvgLoaderPlugin,
  createSvgLoader
}
