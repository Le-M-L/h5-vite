import { LAYOUT } from '@/router/constant';
// 在线表单相关路由
const baseForm = {
  path: '/online',
  name: 'online',
  redirect: '/online/cgformList',
  component: LAYOUT,
  meta: {},
  children: [
    {
      // 在线开发 列表
      path: 'cgformList/:code',
      name: 'cgformListPage',
      meta: {
        isErp: false,
      },
      component: () => import('@/components/OnlineList/src/index.vue'),
    },
    {
      // 在线表单开发 一对多
      path: 'cgformErpList/:code',
      name: 'cgformErpListPage',
      meta: {
        isErp: true,
      },
      component: () => import('@/components/OnlineList/src/index.vue'),
    },
    {
      // 在线表单开发 erp子集 列表
      path: 'cgformErpSubList/:code',
      name: 'cgformErpSubList',
      meta: {
        
      },
      component: () => import('@/components/OnlineList/src/BaseSubList/index.vue'),
    },
    {
      // 在线开发 表单
      path: 'form/:code',
      name: 'onlineForm',
      component: () => import('@/components/OnLineForm/src/index.vue'),
    },
    {
      // 在线表单开发 详情
      path: 'detail/:code/:id',
      name: 'onlineDetail',
      meta: {
        readonly: true,
      },
      component: () => import('@/components/OnLineForm/src/index.vue'),
    }
  ],
};

export default baseForm;
