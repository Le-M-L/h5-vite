
import { resolve } from 'path';
import { loadEnv } from 'vite';
import pkg from './package.json';
import dayjs from "dayjs"
// 获取环境变量
import { wrapperEnv } from './build/utils';
// 创建 接口代理s
import { createProxy } from './build/vite/proxy';
// less 全局变量配置
import { generateModifyVars } from './build/generate/generateModifyVars';
// vite 插件配置
import { createVitePlugins } from './build/vite/plugin';
// 生成环境配置
import { OUTPUT_DIR } from './build/constant';



function pathResolve(dir) {
  return resolve(process.cwd(), '.', dir);
}


const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
};



export default ({ command, mode }) => {
  // 项目根目录
  const root = process.cwd();
  const env = loadEnv(mode, root);

  // 当前环境变量
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE, VITE_LEGACY } = viteEnv;
  
  const isBuild = command === 'build';
  return {
    // 公共基础路径
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      // 别名设置
      alias: [
        {
          find: /^@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /^@comps\//,
          replacement: pathResolve('src') + '/components/comps',
        },
      ],
    },
    server: {
      // 本地服务端口
      port: VITE_PORT,
      proxy: createProxy(VITE_PROXY),
      hmr: {
        overlay: true,
      },
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR, // 输出文件名
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 删除 console
          drop_console: VITE_DROP_CONSOLE,
        },
      },
      brotliSize: false, // 关闭brotlize显示可以略微减少包装时间  
      chunkSizeWarningLimit: 1200,
    },
    define: {
      // setting vue-i18-next
      // Suppress warning
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    css: {
      preprocessorOptions: {
        less: {
          modifyVars: generateModifyVars(),
          javascriptEnabled: true,
        },
      },
    },
    // 项目使用的vite插件。 数量大，分开提取和管理  
    plugins: createVitePlugins(viteEnv, isBuild),

  }
}


// https://vitejs.dev/config/
// export default ({ command, mode }) => {
//     const root = process.cwd();

//     const env = loadEnv(mode, root);
//     // The boolean type read by loadEnv is a string. This function can be converted to boolean type
//     const viteEnv = wrapperEnv(env);
//     const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;

//     const isBuild = command === 'build';

//     return {
//         base: VITE_PUBLIC_PATH,
//         root,
//         resolve: {
//             alias: [
//                 {
//                     find: /\/@\//,
//                     replacement: pathResolve('src') + '/',
//                 },
//             ],
//         },

//         server: {
//             // 监听所有本地ip
//             host: true,
//             port: VITE_PORT,
//             // 从.env加载代理配置
//             proxy: createProxy(VITE_PROXY),
//         },
//         build: {
//             target: 'es2015',
//             outDir: OUTPUT_DIR,
//             terserOptions: {
//                 compress: {
//                     keep_infinity: true,
//                     // 用于在生产环境中删除控制台
//                     drop_console: VITE_DROP_CONSOLE,
//                 },
//             },
//             // 关闭brotliSize显示可以略微减少打包时间
//             brotliSize: false,
//             chunkSizeWarningLimit: 2000,
//         },
//         css: {
//             preprocessorOptions: {
//                 less: {
//                     modifyVars: generateModifyVars(),
//                     javascriptEnabled: true,
//                 },
//             },
//         },
//         plugins: createVitePlugins(viteEnv, isBuild),
//         optimizeDeps: {
//             // @iconify/iconify: 依赖项是由@purge-icons/生成的动态且虚拟加载的，因此需要显式地指定它
//             include: [
//                 '@iconify/iconify',
//                 'ant-design-vue/es/locale/zh_CN',
//                 'moment/dist/locale/zh-cn',
//                 'ant-design-vue/es/locale/en_US',
//                 'moment/dist/locale/eu',
//             ],
//             exclude: ['vue-demi', 'consolidate'],
//         },
//     };
// };