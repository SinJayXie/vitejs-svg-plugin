import { Plugin as Plugin_2 } from 'vite';

export declare const createSvgLoader: (opt: SvgLoaderPluginOptions) => Plugin_2<SvgLoaderPluginApi>;

export declare const SvgLoaderPlugin: (option: SvgLoaderPluginOptions) => Plugin_2<SvgLoaderPluginApi>;

declare interface SvgLoaderPluginApi {
    name: string;
}

declare interface SvgLoaderPluginOptions {
    path: string;
    prefix?: string;
    output?: string;
    css?: boolean;
}

export { }
