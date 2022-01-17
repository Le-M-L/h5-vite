import { defineStore } from 'pinia';
import { store } from '@/store';
import { Persistent } from '@/utils/cache/persistent';
import { APP_DARK_MODE_KEY_, PROJ_CFG_KEY } from '@/enums/cacheEnum';
import { deepMerge } from '@/utils';
import { resetRouter } from '@/router';
import { getRawRoute } from '@/utils';

let timeId;
export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    // 页面loading
    pageLoading: false,
    // 项目配置
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    // 缓存路由
    cacheList: new Set(),
  }),
  getters: {
    // 获取 loading 状态
    getPageLoading() {
      return this.pageLoading;
    },
    // 获取项目配置
    getProjectConfig() {
      return this.projectConfig || {};
    },
    // 获取缓存的列表
    getCachedList() {
      return Array.from(this.cacheList);
    },
  },
  actions: {
    // 设置页面加载状态
    setPageLoading(loading) {
      this.pageLoading = loading;
    },
    // 设置 项目配置
    setProjectConfig(config) {
      this.projectConfig = deepMerge(this.projectConfig || {}, config);
      Persistent.setLocal(PROJ_CFG_KEY, this.projectConfig);
    },
    // 页面跳转 进度条 和 加载状态配置
    getTransitionSetting() {
      return this.getProjectConfig.transitionSetting;
    },
    // 初始化状态
    async resetAllState() {
      resetRouter();
      Persistent.clearAll();
    },

    // 设置缓存
    addCache(route) {
      const item = getRawRoute(route);
      const needCache = !item.meta?.ignoreKeepAlive;
      if (!needCache) {
        const name = item.name;
        this.cacheList.add(name);
      }
    },
  },
});

// 需要在设置之外使用
export function useAppStoreWithOut() {
  return useAppStore(store);
}
