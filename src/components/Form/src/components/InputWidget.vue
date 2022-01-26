<template>
  <Field
    v-if="inputProps.name == 'sys_org_code'"
    v-bind="getAttrs"
    :class="{ isDisabled: text }"
    v-model="text"
  />
  <Field v-else v-bind="getAttrs" :class="{ isDisabled: state }" v-model="state" />
</template>

<script>
import { computed, unref } from 'vue';
import { Field } from 'vant';
import { get, omit } from 'lodash';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { useAppStoreWithOut } from '@/store/modules/app';
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
    const appStore = useAppStoreWithOut();
    const inputProps = computed(() => get(attrs, 'inputProps'));
    const getAttrs = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...unref(inputProps),
        label: null,
      };
    });

    const text = computed(() =>
      unref(inputProps).name == 'sys_org_code'
        ? appStore.sysDepart[unref(state)]
        : unref(state),
    );

    return {
      getAttrs,
      state,
      text,
      inputProps,
    };
  },
};
</script>

<style>
</style>