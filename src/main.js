import '@/design/index.less';

// import "virtual:windi.css";
// 使用上面的css 就不需要下面三个
// import 'virtual:windi-base.css';
// import 'virtual:windi-components.css';
// import 'virtual:windi-utilities.css';

// import 'virtual:svg-icons-register';


import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '@/utils/logics/initAppConfig';
import { setupStore } from '@/store';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';
import { registerGlobComp } from '@comp/registerGlobComp';

// 只在生产环境中启用按需导入。
if (import.meta.env.DEV) {
  // import('ant-design-vue/dist/antd.less');
  import('vant/lib/index.css');
}

async function bootstrap() {
  const app = createApp(App);

  // 配置 状态管理
  setupStore(app);

  // 初始化系统内部配置
  initAppConfigStore();

  // 注册全局组件
  registerGlobComp(app);

  // 配置路由
  setupRouter(app);

  // 加载路由守卫
  setupRouterGuard(router);

  // 等待路由加载完成
  // await router.isReady();

  app.mount('#app');
}

bootstrap();
