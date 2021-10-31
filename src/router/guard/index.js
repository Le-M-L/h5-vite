import { unref } from 'vue';
import { warn } from '@/utils/log';
import { useAppStoreWithOut } from '@/store/modules/app';
import { useUserStoreWithOut } from '@/store/modules/user';
import { createPermissionGuard } from './permissionGuard';
import { createStateGuard } from './stateGuard';
import { createParamMenuGuard } from './paramMenuGuard';

import { setRouteChange } from '@/utils/logics/mitt/routeChange';
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel';
import { Modal, notification } from 'ant-design-vue';

import projectSetting from '@/settings/projectSetting';
import nProgress from 'nprogress';

// 不要改变创造的顺序
export function setupRouterGuard(router) {
  createPageGuard(router);
  createPageLoadingGuard(router);
  createHttpGuard(router);
  createScrollGuard(router);
  createMessageGuard(router);
  createProgressGuard(router);
  createPermissionGuard(router);
  createParamMenuGuard(router); // must after createPermissionGuard (menu has been built.)
  createStateGuard(router); // 初始化状态
}

// 处理页面状态的钩子
function createPageGuard(router) {
  // 页面缓存
  const loadedPageMap = new Map();

  router.beforeEach(async (to) => {
    // 页面已经加载，再次打开它会更快，您不需要进行加载和其他处理
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // 通知路由更改
    setRouteChange(to);

    return true;
  });

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
  });
}

// 用于处理页面加载状态
function createPageLoadingGuard(router) {
  const userStore = useUserStoreWithOut();
  const appStore = useAppStoreWithOut();
  const { getOpenPageLoading } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (!userStore.getToken) {
      return true;
    }
    // 如果页面缓存过 直接跳过加载状态
    if (to.meta.loaded) {
      return true;
    }

    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true);
      return true;
    }

    return true;
  });
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      // TODO Looking for a better way
      // 模拟加载时间，以防止闪烁过快，
      setTimeout(() => {
        appStore.setPageLoading(false);
      }, 220);
    }
    return true;
  });
}
/**
 * 切换路由时，用于关闭当前页面以完成请求的界面
 * @param router
 */
function createHttpGuard(router) {
  const { removeAllHttpPending } = projectSetting;
  let axiosCanceler;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    // 切换路由将删除以前的请求
    axiosCanceler?.removeAllPending();
    return true;
  });
}

// 路由开关返回顶部
function createScrollGuard(router) {
  const isHash = (href) => {
    return /^#/.test(href);
  };

  const body = document.body;

  router.afterEach(async (to) => {
    // scroll top
    isHash(to?.href) && body.scrollTo(0, 0);
    return true;
  });
}

/**
 * 用于在切换路由时关闭消息实例
 * @param router
 */
export function createMessageGuard(router) {
  const { closeMessageOnSwitch } = projectSetting;

  router.beforeEach(async () => {
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
    } catch (error) {
      warn('message guard error:' + error);
    }
    return true;
  });
}

// 进度条
export function createProgressGuard(router) {
  const { getOpenNProgress } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (to.meta.loaded) {
      return true;
    }
    unref(getOpenNProgress) && nProgress.start();
    return true;
  });

  router.afterEach(async () => {
    unref(getOpenNProgress) && nProgress.done();
    return true;
  });
}
