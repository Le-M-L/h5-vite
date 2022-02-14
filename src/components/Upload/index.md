vant 文档
https://vant-contrib.gitee.io/vant/#/zh-CN/uploader
# vue3 示例 
 ====================== 图片上传 =============
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

# vue2 示例  图片上传
<template>
  <BasicUpload
    v-model="value"
    @change="handleChange"
    :initData="list"
  />
</template>

<script>
import { BasicUpload } from '@/components/Upload';
export default {
  components: {
    BasicUpload,
  },
  data() {
    return {
      value: [],
      list:'http://test.xmock.top/file/2022-02-14/1644835378881.png'
    };
  },
  methods: {
    handleChange(data) {
      console.log(this.value,data);
    },
  },
};
</script>

<style>
</style>


====================== 文件上传 =============

# vue3 示例
<template>
  <BasicUploadFile v-model="list" @change="handleChange"/>
</template>

<script setup >
import { ref } from "vue"
import { BasicUploadFile } from '@/components/Upload';

const list = ref(['temp/loging_logo_1644838114531.png']);
const handleChange = (data) => {
  console.log(list.value, data);
};
</script>

# vue2 示例

<template>
  <BasicUploadFile v-model="list" @change="handleChange" />
</template>

<script >
import { BasicUploadFile } from '@/components/Upload';
export default {
  components: { BasicUploadFile },
  data() {
    return {
      list: ['temp/loging_logo_1644838114531.png'],
    };
  },
  methods: {
    handleChange(data) {
      console.log(this.list, data);
    },
  },
};
</script>
