<template>
  <div class="basiceNine">
    <ApiRadioGroup />
    <BasicForm :schemas="schemas"> </BasicForm>
  </div>
</template>

<script>
import { ref } from 'vue';
import { BasicForm } from '@/components/Form';
import ApiRadioGroup from '@/components/Form/src/components/ApiRadioGroup.vue';

function optionsListApi(params) {
  return new Promise((r) => {
    setTimeout(() => {
      r([
        {
          name: 'name1',
          id: 1,
        },
        {
          name: 'name2',
          id: 2,
        },
      ]);
    }, 3000);
  });
}

export default {
  components: { BasicForm,  ApiRadioGroup },
  setup() {
    const schemas = [
      {
        defaultValue: '0', //默认值
        component: 'Input', //组件
        field: 'test123',
        label: '测试',
        helpMessage: '666',
        colon: true,
      },
      {
        component: 'Switch', //组件
        field: 'field1',
        label: '测试',
        helpMessage: '666',
        colon: true,
        defaultValue: true,
      },
      {
        component: 'Rate', //评分
        field: 'field2',
        label: '测试',
        colon: true,
        defaultValue: 2,
      },
      {
        component: 'ApiRadioGroup', //评分
        field: 'field244',
        label: '测试',
        colon: true,
        componentProps: {
          api: optionsListApi,
          params: {
            count: 2,
          },
          resultField: 'list',
          // use name as label
          labelField: 'name',
          // use id as value
          valueField: 'id',
        },
        defaultValue: 1,
      },
      {
        component: 'ApiCheckboxGroup', //评分
        field: 'field3',
        label: '测试111',
        colon: true,
        componentProps: {
          api: optionsListApi,
          params: {
            count: 2,
          },
          resultField: 'list',
          // use name as label
          labelField: 'name',
          // use id as value
          valueField: 'id',
        },
      },
      {
        component: 'Slider', //评分
        field: 'field6',
        label: '测试',
        colon: true,
        componentProps: {
          min: 0,
          max: 100,
          range: true,
        },
        defaultValue: 0,
      },
      {
        field: 'divider-basic',
        component: 'Divider',
        label: '基础字段',
      },
      {
        field: 'InputNumber',
        component: 'InputNumber',
        label: '基础字段',
      },
      {
        field: 'InputTextArea',
        component: 'InputTextArea',
        label: '基础字段',
      },
      {
        field: 'ApiSelect',
        component: 'ApiSelect',
        label: '基础字段',
        componentProps: {
          api: optionsListApi,
          // use name as label
          labelField: 'name',
          // use id as value
          valueField: 'id',
        },
        defaultValue:'1'
      },
      {
        field: 'DatePicker',
        component: 'DatePicker',
        label: '基础字段',
        defaultValue:'2020-01-01',
        componentProps:{
          // title:'请选择日期'
        }
      },
      {
        field: 'Upload',
        component: 'Upload',
        label: '基础字段',
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