<template>
  <div class="basiceNine">
    <input type="file" multiple />
    <button @click="handleBtn">点击</button>
    <Switch v-model="value" />
    <ApiRadioGroup />
    <BasicForm :schemas="schemas"> </BasicForm>
  </div>
</template>

<script>
import { ref } from 'vue';
import { Switch, Radio } from 'vant';
import { BasicForm } from '@comp/Form';
import ApiRadioGroup from '@comp/Form/src/components/ApiRadioGroup.vue';

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
  components: { BasicForm, Switch, Radio, ApiRadioGroup },
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
        field: 'field2',
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
    ];
    const handleBtn = () => {};
    const value = ref(false);

    return {
      schemas,
      value,
      handleBtn,
    };
  },
};
</script>

<style>
.basiceNine {
  height: 200vh;
}
</style>