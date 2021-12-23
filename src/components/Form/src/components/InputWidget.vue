<template>
  <Field v-bind="getAttrs" v-model="state" />
</template>

<script>
import { computed } from 'vue';
import { Field } from 'vant';
import { get, omit } from 'lodash';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
export default {
  components: { Field },
  setup(props, { attrs }) {
    const [state] = useRuleFormItem(props);
    const getAttrs = computed(() => {
      return {
        ...attrs,
        ...get(attrs, 'inputProps'),
        inputProps:null
      };
    });

    return {
      state,
      getAttrs,
    };
  },
};
</script>

<style>
</style>