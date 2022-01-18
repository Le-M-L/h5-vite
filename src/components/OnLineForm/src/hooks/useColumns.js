import { ref,unref, computed, onMounted, nextTick } from 'vue';
import { getOnlineFormItem, getOnlineDetail } from '@/api/sys/api';
import { formatSchemas } from '@/components/Form';

// 获取表单配置项
export function useColumns(propsRef, { code, id, setFieldsValue }) {
  const formSchema = ref([]);
  
  // 表单配置
  const getFormSchema = computed(() => unref(formSchema));

  // 获取表单配置
  async function getOnlineFormSchema() {
    let { enhanceJs, head, schema } = await getOnlineFormItem(code);
    formSchema.value = formatSchemas(schema.properties, schema.required || [],!!id);
  }

  async function getOnlineFormData() {
    let data = await getOnlineDetail(code, id);
    setFieldsValue(data);
  }

  
  nextTick(async () => {
    await getOnlineFormSchema();
    id && getOnlineFormData();
  })

  return {
    getFormSchema,
    getOnlineFormSchema,
    getOnlineFormData,
  };
}
