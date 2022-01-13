import { ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
import { isInSetup } from '@/utils/helper/vueHelper';
import { isProdMode } from '@/utils/env';
import { getDynamicProps } from '@/utils';

export function useForm(props) {
  isInSetup();
  const formRef = ref(null);
  const loadedRef = ref(false);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      error('尚未获得窗体实例，请在执行窗体操作时确保窗体已呈现!  ');
    }
    await nextTick();
    return form;
  }

  function register(instance) {
    isProdMode() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;
    formRef.value = instance;

    loadedRef.value = true;

    watchEffect(() => {
      props && instance.setProps(getDynamicProps(props));
    });
  }

  const methods = {
    // TODO promisify
    getFieldsValue: () => {
      return unref(formRef)?.getFieldsValue();
    },
    setFieldsValue: async (values) => {
      const form = await getForm();
      form.setFieldsValue(values);
    },

    resetFields: async () => {
      getForm().then(async (form) => {
        await form.resetFields();
      });
    },

    submit: async () => {
      const form = await getForm();
      return form.submit();
    },
    validate: async (nameList) => {
      const form = await getForm();
      return form.validate(nameList);
    },
    // 更新
    updateSchema: async (data) => {
      const form = await getForm();
      form.updateSchema(data);
    },
    appendSchemaByField: async (schema, prefixField, first) => {
      const form = await getForm();
      form.appendSchemaByField(schema, prefixField, first);
    },
    removeSchemaByFiled: async (field) => {
      unref(formRef)?.removeSchemaByFiled(field);
    },
    clearValidate: async (name) => {
      const form = await getForm();
      form.clearValidate(name);
    },
  };

  return [register, methods];
}
