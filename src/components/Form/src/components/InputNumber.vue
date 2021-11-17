<template>
  <Field v-bind="attrs" v-model="state" type="textarea"  />
</template>

<script>
import { Field } from 'vant';
import { useAttrs } from '@/hooks/core/useAttrs';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

export default {
  name: 'InputNumber',
  components: {
    Field,
  },
  props: {
    modelValue: {
      type: Number,
    },
  },
  setup(props) {
    const attrs = useAttrs();
    const [state] = useRuleFormItem(props);
    
    return { state, attrs };
  },
};
</script>

<style>
</style>