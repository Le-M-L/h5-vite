import { defineStore } from 'pinia';
import { store } from '@/store';
import { Persistent } from '@/utils/cache/persistent';
import { ROW_KEY, PROJ_CFG_KEY, SYS_DEPART } from '@/enums/cacheEnum';
import { deepMerge } from '@/utils';
import { resetRouter } from '@/router';
import { getRawRoute } from '@/utils';
import { getSysDepart } from '@/api/sys/api';
export const useAppStore = defineStore({
  id: 'app',
  state: () => ({
    // 页面loading
    pageLoading: false,
    // 项目配置
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    // 缓存路由
    cacheList: new Set(),
    // 行数据
    rowData: Persistent.getLocal(ROW_KEY) || {},
    // 系统部门
    sysDepart: Persistent.getLocal(SYS_DEPART),
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
    // 获取行数据
    getRowData() {
      return this.rowData;
    },
    // 获取当前页 title
    getPageTitle() {
      console.log(this)
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
    // 用于储存行数据
    async setRowData(data) {
      this.rowData = data;
      Persistent.setLocal(ROW_KEY, this.rowData);
    },
    // 设置系统部门
    async setSysDepart() {
      let departMap = new Map();
      await getSysDepart().then(res => res.forEach(item => departMap.set(item.orgCode, item.departName)))
      this.sysDepart = departMap;
      Persistent.setLocal(SYS_DEPART, this.sysDepart);
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
