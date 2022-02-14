<template>
  <BasicUpload v-model="value" @change="handleChange" :initData="list" />
</template>

<script setup >
import { ref } from "vue"
import { BasicUpload } from '@/components/Upload';

const value = ref([]);
const list = ['http://test.xmock.top/file/2022-02-14/1644835378881.png'];
const handleChange = (data) => {
  console.log(value.value, data);
};
</script>