<template>
  <div class="basiceNine">
    <BasicForm :schemas="schemas" @submit="submit"> </BasicForm>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { Button } from 'vant';
import { BasicForm, formatSchemas } from '@/components/Form';
import {data} from "./data"

export default {
  components: { BasicForm },
  setup() {
    const form = reactive({
      upload: [],
    });
  console.log(formatSchemas(data))
    const schemas = formatSchemas(data);
    const submit = (e) => {
      console.log(e)
    }
    return {
      schemas,
      submit
    };
  },
};
</script>

<style>
.basiceNine {
  height: 200vh;
}
</style>