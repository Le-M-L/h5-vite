vant 官网
https://vant-contrib.gitee.io/vant/#/zh-CN/calendar#jie-shao
# vue3 使用示例
<template>
  <DCalendar v-model="value" type="range" format="YYYY-MM-DD" :inputProps="{ label: 'test' }" />
</template>
<script setup >
import { ref, watch } from 'vue';
import { DCalendar } from '@/components/DCalendar';
const value = ref('2022-1-12');
</script>

#vue2 使用示例
<template>
  <DCalendar v-model="value" type="range" format="YYYY-MM-DD" :inputProps="{ label: 'test' }" />
</template>

<script>
import { DCalendar } from '@/components/DCalendar';
export default {
  components: {
    DCalendar,
  },
  data() {
    return {
      value: '2022-1-12',
    };
  },
};
</script>