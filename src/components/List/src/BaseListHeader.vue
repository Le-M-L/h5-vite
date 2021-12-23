<template>
  <div class="base-list-header">
    <DatePicker @change="handleChange" v-model="time" />
  </div>
</template>

<script>
import {  ref } from 'vue';
import { DatePicker } from '@/components/DatePicker';
export default {
  components: {
    DatePicker,
  },
  setup() {
    const time = ref('2020-11-12');
    const handleChange = (val) => {
      console.log(val)
      // time.value = val;
    };
    return {
      time,
      handleChange,
    };
  },
};
</script>

<style>
.base-list-header {
  height: 48px;
}
</style>