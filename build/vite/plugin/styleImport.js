/**
 *  Introduces component library styles on demand.
 * https://github.com/anncwb/vite-plugin-style-import
 */
import styleImport from 'vite-plugin-style-import';

export function configStyleImportPlugin(isBuild) {
  if (!isBuild) {
    return [];
  }
  const styleImportPlugin = styleImport({
    libs: [
      {
        libraryName: 'vant',
        esModule: true,
        resolveStyle: (name) => {
          // 这里是“子组件”列表，无需额外引入样式文件
          const ignoreList = [
      
          ];
          return ignoreList.includes(name) ? '' : `vant/es/${name}/style`;
        },
      },
     
    ],
  });
  return styleImportPlugin;
}
