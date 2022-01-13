import { defineStore } from 'pinia';
import { Persistent } from '@/utils/cache/persistent';
import { ONLINE_CFG_KEY } from '@/enums/cacheEnum';
import {
  getOnlineFormItem,
  getOnlineDetail,
  getErpColumns,
  getListColumns,
  getQueryColumns,
} from '@/api/sys/api';
import { formatSchemas } from '@/components/Form';
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
    },
  }),
  getters: {
    // 获取在线表单配置
    getOnline() {
      return this.onlineConfig || Persistent.getLocal(ONLINE_CFG_KEY);
    },
    // 获取在线表单开发 code
    getOnlineCode() {
      return this.getOnline.code;
    },
    // 获取在线表单开发 表单配置
    getOnlineFormSchema() {
      return this.getOnline.formSchema;
    },
    // 获取在线表单开发 erp子集配置
    getOnlineSubList() {
      console.log(this.getOnline.subList)
      return this.getOnline.subList;
    },
  },
  actions: {
    // 设置表单开发配置
    setOnlineCfg(config){
      this.onlineConfig = deepMerge(this.onlineConfig || {}, config);
      Persistent.setLocal(ONLINE_CFG_KEY, this.onlineConfig);
    },
    // 设置在线表单开发
    async setOnlineFormSchema(code, id) {
      let { enhanceJs, head, schema } = await getOnlineFormItem(code);
      // 对在线开发 表单配置格式化
      const formSchema = formatSchemas(schema.properties, schema.required || [], !!id);
      this.setOnlineCfg({formSchema})
      let data = id && (await getOnlineDetail(code, id));
      return data;
    },
    // 在线表单 查询配置
    async setOnlineQueryColumns(code){
        let result = await getQueryColumns(code);
        return result
    },
    // 设置在线表单开发 单表列表配置
    async setOnlineColumns(code) {
      let result = await getListColumns(code);
      return result;
    },
    // 设置在线表单开发erp列表配置
    async setOnlineErpColumns(code) {
      let { main, subList } = await getErpColumns(code);
      this.setOnlineCfg({subList})
      return main;
    },
  },
});

// 使用 在线开发 状态
export function useOnlineStoreWithOut(store) {
  return useOnlineStore(store);
}
