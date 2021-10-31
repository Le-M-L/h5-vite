<template>
  <van-form @submit="onSubmit">
    <div style="margin: 16px">
      <van-button round block type="primary" native-type="submit"> 提交 </van-button>
    </div>
  </van-form>
</template>

<script>
import { ref } from 'vue';
export default {
  setup() {
    const onSubmit = (values) => {
      console.log('submit', values);
    };

    return {
      onSubmit,
    };
  },
};
</script>

<style>
</style>