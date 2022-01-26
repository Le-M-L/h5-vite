import { defineStore } from 'pinia';
import { Persistent } from '@/utils/cache/persistent';
import { ONLINE_CFG_KEY } from '@/enums/cacheEnum';
import { deepMerge } from '@/utils';

export const useOnlineStore = defineStore({
  id: 'online',
  state: () => ({
    // 在线表单配置
    onlineConfig: {
      // 在线开发 表单配置
      formSchema: [],
      // 在线开发 列表配置
      listSchema: [],
      // 在线开发 列表查询配置
      querySchema: [],
      // 在线开发 code
      code: '',
      // erp 多表 子集
      subList: [],
      // 当前列表 主信息
      main: {},
      // erp 子数据 信息
      sunMain: {},
    },
  }),
  getters: {
    // 获取在线表单配置
    getOnline() {
      return this.onlineConfig || Persistent.getLocal(ONLINE_CFG_KEY);
    },
    // 获取在线表单开发 erp子集配置
    getOnlineSubList() {
      return this.getOnline.subList;
    },
    // 获取在线表单 主列表信息
    getOnlineMain() {
      return this.getOnline.main;
    },
    // 获取在线表单 子列表信息
    getOnlineSunMain() {
      return this.getOnline.sunMain;
    },
    // 获取在线表单 主列表 title
    getOnlineMainTitle(){
      let title =  this.getOnlineMain.description?.split('-') || [];
      return title[title.length -1];
    }
  },
  actions: {
    // 设置表单开发配置
    setOnlineCfg(config) {
      this.onlineConfig = deepMerge(this.onlineConfig || {}, config);
      Persistent.setLocal(ONLINE_CFG_KEY, this.onlineConfig);
    },

  },
});

// 使用 在线开发 状态
export function useOnlineStoreWithOut(store) {
  return useOnlineStore(store);
}
