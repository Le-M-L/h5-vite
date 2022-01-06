export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

export const EXCEPTION_COMPONENT = () => import('@/pages/sys/exception/Exception.vue');


/**
 * @description: layou布局
 */
 export const LAYOUT = () => import('@/layouts/default/index.vue');

 export const PAGE_LAYOUT = () => import('@/layouts/page/index.vue');

// 在线表单
export const ONLINE_FORM = () => import('@/components/OnlineList/src/index.vue');

 /**
 * @description: 父级布局
 */
export const getParentLayout = () => {
    return () =>
      new Promise((resolve) => {
        resolve({
          name: PARENT_LAYOUT_NAME,
        });
      });
  };
  