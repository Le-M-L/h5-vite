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
      name: 'CgformListPage',
      meta: {
        isErp: false,
        ignoreKeepAlive: true,
      },
      component: () => import('@/components/OnlineList/src/index.vue'),
    },
    {
      // 在线表单开发 erp子集 列表
      path: 'cgformErpSubList/:code',
      name: 'CgformErpSubList',
      meta: {
        ignoreKeepAlive: true,
      },
      component: () => import('@/components/OnlineList/src/BaseSubList/index.vue'),
    },
    {
      // 在线开发 表单
      path: 'form/:code',
      name: 'OnLineForm',
      component: () => import('@/components/OnLineForm/src/index.vue'),
      meta: {
        ignoreKeepAlive: true,
      },
    },
    {
      // 在线表单开发 一对多
      path: 'cgformErpList/:code',
      name: 'CgformErpListPage',
      meta: {
        isErp: true,
        ignoreKeepAlive: true,
        currentActiveMenu: '/online/cgformList/:code',
      },
      component: () => import('@/components/OnlineList/src/index.vue'),
    },
    {
      // 在线表单开发 详情
      path: 'detail/:code/:id',
      name: 'OnLineFormDetail',
      meta: {
        readonly: true,
        ignoreKeepAlive: true,
        // currentActiveMenu: '/online/form/:code',
      },
      component: () => import('@/components/OnLineForm/src/index.vue'),
    },
  ],
};

export default baseForm;
