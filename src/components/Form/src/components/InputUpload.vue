<template>
 <div class="van-cell van-field" >
    <BasicUpload @change="handleChange" :initData="initData" v-bind="getBindValue" />
 </div>
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
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label:null
      };
    });

    const initData = computed(() => props.modelValue)
    

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, ['inputProps', 'modelValue']),
      };
    });
    console.log(getBindValue)
    const handleChange = (val) => {
      console.log(val)
      emit('change', val.join());
    };
    return { state, initData, getAttrs, getBindValue, handleChange };
  },
};
</script>

<style>
</style>