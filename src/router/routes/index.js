import { PageEnum } from '@/enums/pageEnum';

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

export const Home = {
  path: '/home',
  name: 'Home',
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '登录页',
  },
};

// 基础路由 无权限
export const basicRoutes = [LoginRoute, RootRoute,Home];
