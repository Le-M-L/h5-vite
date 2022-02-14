

vant 文档
https://vant-contrib.gitee.io/vant/v3/#/zh-CN/picker

# vue3 使用示例
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
# ----------------------------------------------------------------

# vue2 使用示例
<template>
  <DSelect v-model="value" :api="api" :options="options" />
</template>

<script>
import { DSelect } from '@/components/DSelect';
export default {
  components: { DSelect },
  data() {
    return {
      value: '1',
      options: [
        {
          text: '测试',
          value: '1',
        },
        {
          text: '测试1',
          value: '2',
        },
      ],
    };
  },
  methods: {
    api() {
      return new Promise((r) => {
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
      });
    },
  },
};
</script>

<style>
</style>
