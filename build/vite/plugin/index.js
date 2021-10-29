import vue from '@vitejs/plugin-vue';
// 支持JSX
import vueJsx from '@vitejs/plugin-vue-jsx';
// 兼容低版本浏览器
import legacy from '@vitejs/plugin-legacy';
// setup 扩展
import vueSetupExtend from 'vite-plugin-vue-setup-extend';
// css库
// import WindiCSS from 'vite-plugin-windicss';
// 针对 index.html，提供压缩和基于 ejs 模板功能的 vite 插件。
import { configHtmlPlugin } from './html';
// mock 模拟数据
import { configMockPlugin } from './mock';
// 代码压缩
import { configCompressPlugin } from './compress';
// 按需引入样式
import { configStyleImportPlugin } from './styleImport';
// 打包资源分析
import { configVisualizerConfig } from './visualizer';
// 图片资源压缩
import { configImageminPlugin } from './imagemin';
// 快速创建svg
import { configSvgIconsPlugin } from './svgSprite';
// 解决Vite循环依赖问题
import { configHmrPlugin } from './hmr';

export function createVitePlugins(viteEnv, isBuild) {
  const {
    VITE_USE_IMAGEMIN,
    VITE_USE_MOCK,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
  } = viteEnv;

  const vitePlugins = [
    // have to
    vue(),
    // have to
    vueJsx(),
    // support name
    vueSetupExtend(),
    // vite-plugin-windicss
    // WindiCSS(),
  ];

  // 是否兼容低版本浏览器
  VITE_LEGACY && isBuild && vitePlugins.push(legacy());

  // TODO
  !isBuild && vitePlugins.push(configHmrPlugin());

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild));

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild));

  // vite-plugin-mock
  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // vite-plugin-style-import
  vitePlugins.push(configStyleImportPlugin(isBuild));

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig());

  if (isBuild) {
    //vite-plugin-imagemin
    VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin());

    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    );
  }

  return vitePlugins;
}
