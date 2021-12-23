<template>
  <Field />
  <Calendar />
</template>

<script>
import { ref } from 'vue';
import { Calendar, Field, Popup } from 'vant';
import { get, omit } from 'lodash-es';
export default {
  name: 'FormCalendar',
  inheritAttrs: false,
  components: { Calendar, Field },
  props:{

  },
  setup() {
    const date = ref('')
    return {

    };
  },
};
</script>

<style>
</style>