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
        ...get(attrs, 'inputProps'),
        ...omit(attrs, 'inputProps'),
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