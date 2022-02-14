<template>
  <customMap v-bind="getBindValue" @change="handleChange" />
</template>

<script >
import { computed } from 'vue';
import { useAttrs } from '@/hooks/core/useAttrs';
import customMap from './index.vue';
export default {
  components: { customMap },
  props: {
    lngField: {
      type: String,
      default: 'longitude',
    },
    latField: {
      type: String,
      default: 'latitude',
    },
    formData: {
      type: Object,
      default: null,
    },
  },
  emits: ['update:modelValue','change'],
  setup(props, { emit }) {
    const attrs = useAttrs();
    const getBindValue = computed(() => {
      return {
        ...attrs,
        ...props,
      };
    });
    const handleChange = (address, lonlat) => {
      emit('update:modelValue', address);
      emit('change',lonlat)
    };

    return {
      getBindValue,
      handleChange,
    };
  },
};
</script>

