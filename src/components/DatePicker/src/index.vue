<template>
  <DatePicker v-bind="getBindValue" @change="handleChange" />
</template>

<script>
import { computed } from 'vue';
import DatePicker from '@/components/Form/src/components/DatePicker.vue';
export default {
  inheritAttrs: false,
  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
  components: { DatePicker },
  emits: ['update:modelValue','change'],
  setup(props, { emit, attrs }) {
    const handleChange = (val) => {
      emit('update:modelValue', val);
      emit('change',val)
    };
    const getBindValue = computed(() => {
      return {
        ...attrs,
        modelValue: props.modelValue,
      };
    });
    console.log(getBindValue.value)
    return {
      handleChange,
      getBindValue,
    };
  },
};
</script>

<style>
</style>