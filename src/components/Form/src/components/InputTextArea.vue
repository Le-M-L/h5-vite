<template>
  <Field v-bind="attrs" v-model="state" type="number" />
</template>

<script>
import { Field } from 'vant';
import { useAttrs } from '@/hooks/core/useAttrs';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

export default {
  name: 'InputTextArea',
  components: {
    Field,
  },
  props: {
    modelValue: {
      type: [ String ,Number],
      default:null
    },
  },
  emits: ['change'],
  setup(props) {
    const attrs = useAttrs();
    const [state] = useRuleFormItem(props);

    return { state, attrs };
  },
};
</script>

<style>
</style>