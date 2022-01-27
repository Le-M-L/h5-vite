<template>
  <DSelect v-model="value" :api="api" :options="options" :inputProps="{ label: 'test' }" />
</template>

<script setup >
import { ref, watch } from 'vue';
import { DSelect } from '@/components/DSelect';
const value = ref('1');
const api = () => {
  setTimeout(() => {
    r([
      {
        text: '测试22',
        value: '1',
      },
      {
        text: '测试33',
        value: '2',
      },
    ]);
  }, 2000);
};
const options = ref([
  {
    text: '测试',
    value: '1',
  },
  {
    text: '测试1',
    value: '2',
  },
]);

watch(
  () => value.value,
  (val) => {
    console.log(val);
  },
);
</script>
