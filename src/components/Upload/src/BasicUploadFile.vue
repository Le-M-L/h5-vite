<template>
  <UploadFile @change="handleChange" />
</template>

<script>
import UploadFile from './UploadFile.vue';
export default {
  components: { UploadFile },
  emits: ['update:modelValue', 'change', 'delete'],
  setup(_, { emit }) {
    const handleChange = (val) => {
      emit('update:modelValue', val);
      emit('change', val);
    };

    return {
      handleChange,
    };
  },
};
</script>

<style>
</style>