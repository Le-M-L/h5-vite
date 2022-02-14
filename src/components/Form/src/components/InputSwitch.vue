<template>
  <Field v-bind="getAttrs" readonly>
    <template #input>
      <Switch v-bind="getBindValue" v-model="getValue" @change="handleChange" size="20" />
    </template>
  </Field>
</template>

<script>
import { computed } from 'vue';
import { Switch, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

export default {
  name: 'ApiRadioGroup',
  components: {
    Switch,
    Field,
  },
  props: {
    api: {
      type: Function,
      default: null,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['change'],
  setup(props, { attrs, emit }) {
    const [state] = useRuleFormItem(props);

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });
    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
        disabled:getAttrs.value.readonly
      };
    });

    const getValue = computed(() => (state.value == 'Y' ? true : false));

    const handleChange = (val) => {
      emit('change', val ? 'Y' : 'N');
    };

    return { getValue, getAttrs, getBindValue, handleChange };
  },
};
</script>

<style>
</style>