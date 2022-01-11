<template>
  <Field
    v-bind="getAttrs"
    :class="{ isDisabled: state }"
    @error-item="handleItem"
    v-model="state"
  />
</template>

<script>
import { computed, unref, watch } from 'vue';
import { Field } from 'vant';
import { get, omit } from 'lodash';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
export default {
  name: 'InputWidget',
  inheritAttrs: false,
  components: { Field },
  props: {
    modelValue: {
      type: [Array, String],
      default: '',
    },
  },
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
    console.log(getAttrs.value.codeField);

    const handleItem = (e) => {
      console.log(e);
    };

    watch(
      () => state.value,
      (val) => {
        console.log(val);
      },
    );

    return {
      state,
      getAttrs,
      handleItem,
    };
  },
};
</script>

<style>
</style>