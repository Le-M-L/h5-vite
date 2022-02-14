

vant 文档
https://vant-contrib.gitee.io/vant/v3/#/zh-CN/datetime-picker

# vue3 使用示例
<template>
  <DatePicker v-model="value" :inputProps="{ label: 'test' }" />
</template>

<script setup >
import { ref } from "vue";
import { DatePicker } from '@/components/DatePicker';

const value = ref('2022-11-11');
</script>

<style>
</style>
# ----------------------------------------------------------------

# vue2 使用示例
<template>
  <DatePicker v-model="value" :inputProps="{ label: 'test' }" />
</template>

<script>
import { DatePicker } from '@/components/DatePicker';
export default {
  components: { DatePicker },
  data() {
    return {
      value: '2022-11-11 ',
    };
  },
  methods: {},
};
</script>

<style>
</style>