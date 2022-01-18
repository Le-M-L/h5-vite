<template>
  <Field
    v-bind="getAttrs"
    :class="{ isDisabled: getText }"
    @error-item="handleItem"
    v-model="getText"
  />
</template>

<script>
import { computed, unref, watch, watchEffect } from 'vue';
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
    const inputProps = computed(() => get(attrs, 'inputProps'));
    const appStore = useAppStoreWithOut();
    const getAttrs = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        ...unref(inputProps),
        label: null,
      };
    });
    const getText = computed(() => {
      return unref(inputProps).name == 'sys_org_code'
        ? appStore.sysDepart.get(unref(state))
        : unref(state);
    });

    const handleItem = (e) => {
      console.log(e);
    };

    return {
      getText,
      getAttrs,
      handleItem,
    };
  },
};
</script>

<style>
</style>