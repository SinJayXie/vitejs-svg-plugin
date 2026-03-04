export const getTemplate = () => `const icons=[#SVG_DATA#];const gSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');gSvg.setAttribute('id','_vitejs-svg-plugin_');gSvg.setAttribute('style','position: absolute; width: 0; height: 0;');gSvg.setAttribute('aria-hidden','true');gSvg.innerHTML=icons.join('\\n');document.body.prepend(gSvg);`

export const getTemplateText = () => `/**
 * Svg Icon names (vitejs-svg-plugin)
 * @author SinJay Xie
 * @date #date#
 * @description Load SVG amount: #amount#
 */
export type SvgIconNames = #ICON_LIST#;
`
