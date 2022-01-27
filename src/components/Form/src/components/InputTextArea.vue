<template>
  <Field v-bind="getAttrs"  :class="{ isDisabled: state }" v-model="state" type="textarea"  />
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
        autosize:true,
        ...attrs,
        ...get(attrs,'inputProps'),
        inputProps:null,
      }
    })
    return { state, getAttrs };
  },
};
</script>

<style>
</style>