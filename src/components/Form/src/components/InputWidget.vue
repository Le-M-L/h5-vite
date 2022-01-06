<template>
  <Field v-bind="getAttrs"  @error-item="handleItem" v-model="state" />
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
    console.log(getAttrs.value)
    const isError = computed(() => unref(getAttrs).isError)
  
    const handleItem = (e) =>{
      console.log(e)
    }
    return {
      state,
      getAttrs,
      isError,
      handleItem
    };
  },
};
</script>

<style>
</style>