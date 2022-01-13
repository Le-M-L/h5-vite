import { PAGE_LAYOUT } from '@/router/constant';
// 在线表单相关路由
const baseForm = {
  path: '/sys',
  name: 'sys',
  redirect: '/sys/home',
  component: PAGE_LAYOUT,
  meta: {},
  children: [
    {
      path: '/sys/home',
      name: 'HomePage',
      component: () => import('@/pages/sys/home/index.vue'),
      meta: {
        title: '主页面',
      },
    },
    {
      path: '/sys/setting',
      name: 'SettingPage',
      component: () => import('@/pages/sys/setting/index.vue'),
      meta: {
        title: '个人页',
      },
    },
  ],
};

export default baseForm;
