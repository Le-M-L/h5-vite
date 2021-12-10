<template>
  <div class="basiceNine">
    <input type="file" @change="handleChange" />
    <Button @click="handleStart">开始录音</Button>
    <Button @click="handleEnd">结束录音</Button>
    <Button @click="getRecorder">获取录音数据</Button>

    <Button @click="handleVideo" >录音回放</Button>

    <span>{{ progress }}</span>
    <!-- <img :src="imgRrc" alt="" /> -->
    <BasicUpload v-model="form.upload" />
    <button @click="getForm">获取form</button>
    <ApiRadioGroup />
    <BasicForm :schemas="schemas"> </BasicForm>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { Button } from 'vant';
import { BasicForm } from '@/components/Form';
import ApiRadioGroup from '@/components/Form/src/components/ApiRadioGroup.vue';
import { BasicUpload } from '@/components/Upload';
import { initWebScoket } from './utils';
import iatRecorder from './audio';
import Recorder from 'js-audio-recorder';


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
  components: { BasicForm, ApiRadioGroup, BasicUpload, Button },
  setup() {
    const form = reactive({
      upload: [],
    });

    const recorder = new Recorder();

    const progress = ref();

    const handleStart = () => {
      // 录音开始
      recorder.start();
      iatRecorder.start()
    };

    const handleEnd = () => {
      // 录音开始
      iatRecorder.stop()
      recorder.stop();
    };

    // 获取录音
    const getRecorder = () => {
      console.log(recorder);
      console.log(recorder.getWAV());
    };


    window.onmessage = (e) => {
      console.log(e)
    }

    const handleVideo = () => {
      // recorder.play();
      window.postMessage('666')
    }

    console.log(iatRecorder)

    const formateSeconds = (endTime = 0) => {
      let secondTime = parseInt(endTime); //将传入的秒的值转化为Number
      let min = 0; // 初始化分
      let h = 0; // 初始化小时
      let result = '';
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        min = parseInt(secondTime / 60); //获取分钟，除以60取整数，得到整数分钟
        secondTime = parseInt(secondTime % 60); //获取秒数，秒数取佘，得到整数秒数
        if (min >= 60) {
          //如果分钟大于60，将分钟转换成小时
          h = parseInt(min / 60); //获取小时，获取分钟除以60，得到整数小时
          min = parseInt(min % 60); //获取小时后取佘的分，获取分钟除以60取佘的分
        }
      }
      result = `${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}:${secondTime
        .toString()
        .padStart(2, '0')}`;
      return result;
    };

    // 获取录音时长
    recorder.onprogress = (params) => {
      console.log(params)
      progress.value = formateSeconds(params.duration.toFixed(2));
    };

    const { webSocket } = initWebScoket();

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
        defaultValue: '2',
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
          valueField:'id',
          labelField:'name'

        },
        defaultValue: 2 ,
      },
    ];

    const imgRrc = ref('');
    const reader = new FileReader();
    console.log(reader.readyState);

    const handleChange = ({ target: { files } }) => {
      console.log(files)
      // reader.readAsText(files[0]);
      // console.log(reader.readyState);
      // reader.onload = () => {
      //   // imgRrc.value = reader.result;
      //   console.log(reader.readyState);
      // };
    };

    const getForm = () => {
      console.log(form);
    };

    return {
      schemas,
      handleStart,
      handleEnd,
      handleChange,
      getRecorder,
      imgRrc,
      form,
      getForm,
      progress,
      handleVideo
    };
  },
};
</script>

<style>
.basiceNine {
  height: 200vh;
}
</style>