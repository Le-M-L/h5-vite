<template>
  <Field v-bind="getAttrs" style="display: none" v-model="getValue" readonly />
  <div class="van-cell van-field">
    <BasicUpload
      style="margin-top: 8px"
      @change="handleChange"
      :initData="initData"
      v-bind="getBindValue"
    />
  </div>
</template>

<script>
import { computed, watch, unref, ref } from 'vue';
import { Field } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { get, omit } from 'lodash';
import { BasicUpload } from '@/components/Upload';
import { isArray } from "@/utils/is"
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
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
      };
    });
    const getValue = computed(() => {
        return isArray(unref(state)) ? unref(state).join():unref(state)
    })
    const initData = computed(() => props.modelValue);
    const getBindValue = computed(() => {
      return {
        ...omit(attrs, ['inputProps', 'modelValue']),
        disabled: getAttrs.value.readonly,
      };
    });
    const handleChange = (val) => {
      emit('change', val.join());
    };
    return { getValue, initData, getAttrs, getBindValue, handleChange };
  },
};
</script>

<style>
</style>