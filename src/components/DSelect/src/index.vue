<template>
  <ApiSelect ref="select" v-bind="getBindValue" @change="handleChange">
    <template #[item]="data" v-for="item in Object.keys($slots)">
      <slot :name="item" v-bind="data || {}"></slot>
    </template>
  </ApiSelect>
</template>

<script>
import { computed, ref, unref } from 'vue';
import ApiSelect from '@/components/Form/src/components/ApiSelect.vue';
export default {
  inheritAttrs: false,
  props: {
    modelValue: {
      type: [String, Number],
      default: '',
    },
  },
  components: { ApiSelect },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, attrs, expose }) {
    const select = ref(null);

  

    const getBindValue = computed(() => {
      return {
        ...attrs,
        modelValue: props.modelValue,
      };
    });

    const handleChange = (obj) => {
      emit('update:modelValue', obj.value);
      emit('change', obj.value,unref(getBindValue));
    };
    const handleShow = () => {
      unref(select).show = true;
    }

    expose({ handleShow });
    return {
      handleChange,
      getBindValue,
      select,
    };
  },
};
</script>

<style>
</style>