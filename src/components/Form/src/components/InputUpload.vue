<template>
  <Field v-bind="getAttrs" v-model="state" readonly required />
  <BasicUpload @change="handleChange" :initData="initData" v-bind="getBindValue" />
</template>

<script>
import { computed, watch, unref, ref } from 'vue';
import { Field } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { get, omit } from 'lodash';
import { BasicUpload } from '@/components/Upload';
export default {
  name: 'InputNumber',
  inheritAttrs: false,
  components: {
    Field,
    BasicUpload,
  },
  props: {
    modelValue: {
      type: [Array, String],
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const [state] = useRuleFormItem(props);
    const initData = ref([]);
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });

    watch(
      () => unref(state),
      (val) => {
        initData.value = val;
      },
    );
    const getBindValue = computed(() => {
      return {
        ...omit(attrs, ['inputProps', 'modelValue']),
      };
    });
    const handleChange = (val) => {
      emit('change', val.join());
    };
    return { state, initData, getAttrs, getBindValue, handleChange };
  },
};
</script>

<style>
</style>