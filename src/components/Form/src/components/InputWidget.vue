<template>
  <Field v-bind="getAttrs" v-model="state" />
</template>

<script>
import { computed, unref } from 'vue';
import { Field } from 'vant';
import { get, omit } from 'lodash';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
export default {
  inheritAttrs: false,
  components: { Field },
  setup(props, { attrs }) {
    const [state] = useRuleFormItem(props);
    const inputProps = computed(() => get(attrs, 'inputProps'));

    const getAttrs = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...unref(inputProps),
        label: null,
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