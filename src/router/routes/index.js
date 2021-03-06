import { PageEnum } from '@/enums/pageEnum';

// 获取所有子模版数据
const modules = import.meta.globEager('./modules/**/*.js');
const routeModuleList = [];
Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});


// 异步路由
export const asyncRoutes = [];
export const RootRoute = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
};

export const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/sys/login/Login.vue'),
  meta: {
    title: '登录页',
  },
};


// 基础路由 无权限
export const basicRoutes = [LoginRoute, RootRoute, ...routeModuleList];
