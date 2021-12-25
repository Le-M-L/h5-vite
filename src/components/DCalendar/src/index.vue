<template>
  <InputCalendar v-bind="getBindValue" @change="handleChange">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </InputCalendar>
</template>

<script>
import { computed, unref } from 'vue';
import { InputCalendar } from '@/components/Form';

export default {
  props: {
    modelValue: {
      type: [String, Array],
      default: '',
    },
  },
  components: { InputCalendar },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, attrs }) {
    const getBindValue = computed(() => {
      return {
        ...attrs,
        modelValue: props.modelValue,
      };
    });

    const handleChange = (data) => {
      emit('update:modelValue', data);
      emit('change', data);
    };

    return {
      handleChange,
      getBindValue,
    };
  },
};
</script>

<style>
</style>