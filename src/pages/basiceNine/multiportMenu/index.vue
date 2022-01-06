<template>
  <div class="basiceNine">
    <!-- <BaseList :columns="listColumns" /> -->
    <BasicForm :schemas="schemas" @submit="submit"> </BasicForm>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { Button } from 'vant';
import { BasicForm, formatSchemas } from '@/components/Form';
import { data, listColumns } from './data';
import { BaseList } from "@/components/OnlineList"
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
      listColumns
    };
  },
};
</script>

<style>
.basiceNine {
  height: 100vh;
}
</style>