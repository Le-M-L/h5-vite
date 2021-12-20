<template>
  <Field v-bind="getAttrs" readonly>
    <template #input>
      <Rate v-bind="getBindValue" v-model="state" size="20" />
    </template>
  </Field>
</template>

<script>
import { computed, unref } from 'vue';
import { Rate, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

export default {
  name: 'ApiRadioGroup',
  components: {
    Rate,
    Field,
  },
  props: {
    api: {
      type: Function,
      default: null,
    },
    modelValue: {
      type: [String, Number],
    },
  },
  emits: ['change'],
  setup(props, { attrs }) {
    const [state] = useRuleFormItem(props);


    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });

    const getBindValue = computed(() => {
      return omit(attrs, 'inputProps');
    });

    return { state, getAttrs, getBindValue };
  },
};
</script>

<style>
</style>