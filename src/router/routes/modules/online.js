import { PAGE_LAYOUT } from '@/router/constant';
// 在线表单相关路由
const baseForm = {
  path: '/online',
  name: 'online',
  redirect: '/online/cgformErpList',
  component: PAGE_LAYOUT,
  meta: {},
  children: [
    {
      // 在线开发 列表
      path: 'cgformErpList/:code',
      name: 'CgformErpListPage',
      component: () => import('@/components/OnlineList/src/index.vue'),
    },
    { // 在线开发 表单
      path: 'form/:code',
      name: 'onlineForm',
      component: () => import('@/components/OnLineForm/src/index.vue'),
    },
  ],
};

export default baseForm;
