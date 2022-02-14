

# vue3 示例
<template>
  <BasicMap v-model="formData.value" @change="handleChange" :formData="formData" :inputProps="{ label: 'test' }" />
</template>

<script setup >
import { ref } from "vue";
import { BasicMap } from '@/components/Map';
const formData = ref({})
const handleChange = (lnglat) => {
  console.log(lnglat)
}
</script>


# vue2 示例

<template>
  <BasicMap
    v-model="formData.value"
    @change="handleChange"
    :formData="formData"
    :inputProps="{ label: 'test' }"
  />
</template>

<script>
import { BasicMap } from '@/components/Map';
export default {
  components: {
    BasicMap,
  },
  data() {
    return {
      formData: {},
    };
  },
  methods: {
    handleChange(lnglat) {
      console.log(lnglat);
    },
  },
};
</script>

<style>
</style>