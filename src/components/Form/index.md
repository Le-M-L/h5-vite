
# vue3 示例
<template>
  <van-button @click="handleClick">按钮</van-button>
  <BasicForm :schemas="schemas" @register="register"> </BasicForm>
</template>

<script setup >
import { BasicForm, useForm } from '@/components/Form';
const [register, { submit }] = useForm();
/** 表单提交 */
const handleClick = async () => {
  let data = await submit();
  console.log(data);
};
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
        {
          name: 'name3',
          id: 3,
        },
      ]);
    }, 3000);
  });
}
const schemas = [
  {
    defaultValue: '0', //默认值
    component: 'Input', //组件
    field: 'test123', // 字段名
    label: '测试', // label
  },
  {
    component: 'Switch',
    field: 'field1',
    label: '测试',
    defaultValue: true,
  },
  {
    component: 'Rate',
    field: 'field2',
    label: '测试',
    defaultValue: 2,
  },
  {
    component: 'ApiRadioGroup',
    field: 'field244',
    label: '测试',
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
    component: 'ApiCheckboxGroup',
    field: 'field3',
    label: '测试111',
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
    component: 'Slider',
    field: 'field6',
    label: '测试',
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
    label: '分隔线',
  },
  {
    field: 'InputNumber',
    component: 'InputNumber',
    label: '数字',
  },
  {
    field: 'InputTextArea',
    component: 'InputTextArea',
    label: '多行文本框',
  },
  {
    field: 'ApiSelect',
    component: 'ApiSelect',
    label: '选择',
    componentProps: {
      api: optionsListApi,
      // use name as label
      labelField: 'name',
      // use id as value
      valueField: 'id',
    },
    defaultValue: 2,
  },
  {
    field: 'DatePicker',
    component: 'DatePicker',
    label: '基础字段',
    defaultValue: '2020-01-01',
    componentProps: {
      // title:'请选择日期'
    },
  },
  {
    field: 'Upload',
    component: 'Upload',
    label: '基础字段',
    componentProps: {
      maxCount: 3,
      multiple: true,
      onDelete: (file) => {
        console.log(file);
      },
    },
    defaultValue: ['bg_1637630604113.png'],
  },
  {
    field: 'ApiCascader',
    component: 'ApiCascader',
    label: '联级选择器',
    componentProps: {
      api: optionsListApi,
      valueField: 'id',
      labelField: 'name',
    },
    defaultValue: 2,
  },
  {
    field: 'map',
    component: 'CustomMap',
    label: '地图',
    componentProps: {
      onChange: (e) => {
        console.log(e);
      },
      lngField: 'longitude',
      latField: 'latitude',
    },
    defaultValue: '浙江省舟山市岱山县长涂镇娘杨线',
  },
  {
    field: 'longitude',
    component: 'Input',
    show: false,
  },
  {
    field: 'latitude',
    component: 'Input',
    show: false,
  },
];
</script>

========================= vue2 ================================
# vue2 写法

<template>
  <van-button @click="handleClick">按钮</van-button>
  <BasicForm :schemas="schemas" @register="register"> </BasicForm>
</template>

<script  >
import { BasicForm, useForm } from '@/components/Form';
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
        {
          name: 'name3',
          id: 3,
        },
      ]);
    }, 3000);
  });
}
export default {
  components: {
    BasicForm,
  },
  data() {
    return {
      schemas: [
        {
          defaultValue: '0', //默认值
          component: 'Input', //组件
          field: 'test123', // 字段名
          label: '测试', // label
        },
        {
          component: 'Switch',
          field: 'field1',
          label: '测试',
          defaultValue: true,
        },
        {
          component: 'Rate',
          field: 'field2',
          label: '测试',
          defaultValue: 2,
        },
        {
          component: 'ApiRadioGroup',
          field: 'field244',
          label: '测试',
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
          component: 'ApiCheckboxGroup',
          field: 'field3',
          label: '测试111',
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
          component: 'Slider',
          field: 'field6',
          label: '测试',
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
          label: '分隔线',
        },
        {
          field: 'InputNumber',
          component: 'InputNumber',
          label: '数字',
        },
        {
          field: 'InputTextArea',
          component: 'InputTextArea',
          label: '多行文本框',
        },
        {
          field: 'ApiSelect',
          component: 'ApiSelect',
          label: '选择',
          componentProps: {
            api: optionsListApi,
            // use name as label
            labelField: 'name',
            // use id as value
            valueField: 'id',
          },
          defaultValue: 2,
        },
        {
          field: 'DatePicker',
          component: 'DatePicker',
          label: '基础字段',
          defaultValue: '2020-01-01',
          componentProps: {
            // title:'请选择日期'
          },
        },
        {
          field: 'Upload',
          component: 'Upload',
          label: '基础字段',
          componentProps: {
            maxCount: 3,
            multiple: true,
            onDelete: (file) => {
              console.log(file);
            },
          },
          defaultValue: ['bg_1637630604113.png'],
        },
        {
          field: 'ApiCascader',
          component: 'ApiCascader',
          label: '联级选择器',
          componentProps: {
            api: optionsListApi,
            valueField: 'id',
            labelField: 'name',
          },
          defaultValue: 2,
        },
        {
          field: 'map',
          component: 'CustomMap',
          label: '地图',
          componentProps: {
            onChange: (e) => {
              console.log(e);
            },
            lngField: 'longitude',
            latField: 'latitude',
          },
          defaultValue: '浙江省舟山市岱山县长涂镇娘杨线',
        },
        {
          field: 'longitude',
          component: 'Input',
          show: false,
        },
        {
          field: 'latitude',
          component: 'Input',
          show: false,
        },
      ],
      register: null,
      actions: {},
    };
  },
  created() {
    const [register, actions] = useForm();
    this.register = register;
    this.actions = actions;
  },
  mounted() {},
  methods: {
    /** 表单提交 */
    async handleClick() {
      let data = await this.actions.submit();
      console.log(data);
    },
  },
};
</script>