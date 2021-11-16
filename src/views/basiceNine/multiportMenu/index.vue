<template>
  <div class="basiceNine">
    <BasicForm :schemas="schemas">
     
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
        field:'test123',
        label:'测试',
        helpMessage: '666',
        colon:true,
        slot:'test'
      },
      {
        component: 'Switch', //组件
        field:'test1235',
        label:'测试',
        helpMessage: '666',
        colon:true,
        defaultValue:true,
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