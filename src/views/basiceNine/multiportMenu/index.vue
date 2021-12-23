<template>
  <div class="basiceNine">
    <!-- <BaseList /> -->
    <BasicForm :schemas="schemas" @submit="submit"> </BasicForm>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { Button } from 'vant';
import { BasicForm, formatSchemas } from '@/components/Form';
import { data } from './data';
import { BaseList } from "@/components/List"
export default {
  components: { BasicForm, BaseList },
  setup() {
    const form = reactive({
      upload: [],
    });
    console.log(formatSchemas(data));
    const schemas = formatSchemas(data);
    const submit = (e) => {
      console.log(e);
    };
    return {
      schemas,
      submit,
    };
  },
};
</script>

<style>
.basiceNine {
  height: 100vh;
}
</style>