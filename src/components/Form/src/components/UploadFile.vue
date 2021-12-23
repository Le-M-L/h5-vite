<template>
<div style="padding:12px 16px 6px;color:#333;font-size:14px" >附件</div>
  <Field style="display:none"  v-model="getText"  v-bind="getAttrs" readonly required />
  <div style="padding:0 16px 12px" >
    <UploadFile v-bind="getBindValue" style="width:100vw" v-model="state" @change="handleChange"   />
  </div>
</template>

<script>
import { computed, unref } from 'vue';
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
      type: [ String,Array],
      default: () => []
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const [state] = useRuleFormItem(props);
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });
    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
      };
    });
    console.log(state)
    const getText = computed(() => unref(state))
    const handleChange = (val) => {
      emit('change',val)
    }
    return { state,getText, getAttrs, getBindValue, handleChange };
  },
};
</script>

<style>
</style>