<template>
  <Field v-bind="getAttrs" v-model="state" type="number"  />
</template>

<script>
import { computed } from "vue"
import { Field } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { get,  omit } from "lodash"
export default {
  name: 'InputNumber',
  components: {
    Field,
  },
  props: {
    modelValue: {
      type: [Number, String],
    },
  },
  emits: ['change'],
  setup(props,{attrs}) {
    const [state] = useRuleFormItem(props);
    const getAttrs = computed(() => {
      return {
        ...get(attrs,'inputProps'),
        ...omit(attrs,'inputProps'),
        label:null
      }
    })
    return { state, getAttrs };
  },
};
</script>

<style>
</style>