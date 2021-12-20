<template>
  <Field v-bind="getAttrs" required errorMessage="123">
  </Field>
    <UploadFile style="width:100vw" v-bind="getBindValue" />
</template>

<script>
import { computed } from 'vue';
import { Field } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { get, omit } from 'lodash';
import { UploadFile } from '@/components/Upload';
export default {
  name: 'InputNumber',
  components: {
    Field,
    UploadFile,
  },
  props: {
    modelValue: {
      type: [Number, String],
    },
  },
  emits: ['change'],
  setup(props, { attrs }) {
    const [state] = useRuleFormItem(props);
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        ...omit(attrs, 'inputProps'),
      };
    });
    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
      };
    });
    return { state, getAttrs, getBindValue };
  },
};
</script>

<style>
</style>