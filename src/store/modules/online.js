import { defineStore } from 'pinia';
import { store } from '@/store';
import { Persistent } from '@/utils/cache/persistent';
import { ON_LINE_CODE } from '@/enums/cacheEnum';
import { getOnlineFormItem } from '@/api/sys/api';
import { formatSchemas } from '@/components/Form';

export const useOnlineStore = defineStore({
  id: 'online',
  state: () => ({
    // 在线开发 表单配置
    formSchema: [],
    // 在线开发 列表配置
    listSchema: [],
    // 在线开发 列表查询配置
    querySchema: [],
    // 在线开发 code
    code: '',
  }),
  getters: {
    // 获取在线开发 code
    getOnlineCode() {
      return this.code || Persistent.getLocal(ON_LINE_CODE);
    },
    getOnlineFormSchema(){
        return this.formSchema
    }
  },
  actions: {
    // 设置在线开发 code
    setOnlineCode(code) {
      this.code = code;
      Persistent.setLocal(ON_LINE_CODE, this.code);
    },
    // 设置在线开发 表单配置
    setOlineFormSchema(schema) {
      this.formSchema = schema;
    },
    async setOnlineFormSchema(code) {
      let { enhanceJs, head, schema } = await getOnlineFormItem(code);
      // 对在线开发 表单配置格式化
      const formSchema = formatSchemas(schema.properties, schema.required || []);
      this.setOlineFormSchema(formSchema);
      console.log(formSchema,schema)
    },
  },
});

// 使用 在线开发 状态
export function useOnlineStoreWithOut(store) {
  return useOnlineStore(store);
}
