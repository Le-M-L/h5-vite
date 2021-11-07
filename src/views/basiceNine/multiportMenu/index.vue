<template>
  <div class="basiceNine">
    <BasicForm :schemas="schemas">
      <template #formHeader>
        <div> 123 </div>
      </template>
    </BasicForm>
  </div>
</template>

<script>
import { BasicForm } from '@comp/Form';
export default {
  components: { BasicForm },
  setup() {
    const schemas = [
      {
        defaultValue: '0', //默认值
        component: 'Input', //组件
        field:'test',
      },
    ];

    return {
      schemas,
    };
  },
};
</script>

<style>
.basiceNine {
  height: 200vh;
}
</style>