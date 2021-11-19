<template>
  <Uploader :after-read="afterRead"> </Uploader>
</template>

<script>
import { Uploader } from "vant";
export default {
  name: 'BasicUpload',
  components: { Uploader },
  emits: ['change'],
  setup(props) {
    const afterRead = (file) => {
        console.log(file)
    };

    return {
      afterRead,
    };
  },
};
</script>

<style>
</style>