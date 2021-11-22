<template>
  <div>
    <Uploader
      :after-read="afterRead"
      :before-read="beforeRead"
      :before-delete="beforeDelete"
      @oversize="oversize"
      v-bind="getBindValue"
      v-model="fileListRef"
    >
    </Uploader>
    <button @click="handleClick">点击</button>
  </div>
</template>

<script>
import { computed, ref, unref, toRefs, watch } from 'vue';
import { Uploader } from 'vant';
import { useUploadType } from './useUpload';
import { basicProps } from './props';
import { useMessage } from '@/hooks/web/useMessage';
import { checkFileType, initFileListArr } from './helper';
import { omit } from 'lodash-es';
import { UploadResultStatus } from './typing';
import { isArray, isFunction } from '@/utils/is';
import { warn } from '@/utils/log';

export default {
  name: 'BasicUpload',
  components: { Uploader },
  props: basicProps,
  emits: ['change', 'delete'],
  setup(props, { emit, attrs }) {
    //   是否正在上传
    const isUploadingRef = ref(false);
    const fileListRef = ref([]);

    const { accept, helpText, maxCount, maxSize } = toRefs(props);
    const { getAccept } = useUploadType({
      acceptRef: accept,
      helpTextRef: helpText,
      maxCountRef: maxCount,
      maxSizeRef: maxSize,
    });

    const { createMessage } = useMessage();

    const getBindValue = computed(() => {
      const value = {
        ...props,
      };
      return omit(value, ['modelValue', 'maxSize']);
    });

    watch(
      () => props.modelValue,
      (value = []) => {
        console.log(props)
        let values = isArray(value) ? value : []
        fileListRef.value = initFileListArr(unref(values))
        console.log(fileListRef.value)
      },
      { immediate: true }
    );

    

    // 文件读取前的回调
    const beforeRead = (file) => {
      const { maxSize } = props;
      const accept = unref(getAccept);
      let files = isArray(file) ? file : [file];
      for (let i = 0; i < files.length; i++) {
        // 超过上传最大限制 提示
        if (maxSize && files[i].size / 1024 / 1024 >= maxSize) {
          createMessage.fail(`只能上传不超过${maxSize}MB的文件!`);
          return false;
        }
        // 设置文件类型判断
        if (accept.length > 0 && !checkFileType(files[i], accept)) {
          createMessage.fail(`只能上传${accept.join(',')}格式文件`);
          return false;
        }
        // 设置进度条状态
        files[i].percent = 0;
        // 设置文件加载状态
        // file.status = UploadResultStatus.UPLOADING;
      }
      return true;
    };

    // 文件选择完成的回调
    const afterRead = async () => {
      const { autoUpload } = props;
      autoUpload && (await handleStartUpload());
      // file.status = UploadResultStatus.SUCCESS;
      emit(
        'change',
        unref(fileListRef).map(({ responseData }) => responseData.message),
      );
      console.log(fileListRef.value);
    };

    const handleClick = () => {
      console.log(fileListRef.value);
    };

    const handleChange = () => {
      console.log(fileListRef.value);
    };

    const beforeDelete = (file) => {
      emit('delete', file);
      return true;
    };

    async function uploadApiByItem(item) {
      const { api } = props;
      if (!api || !isFunction(api)) {
        return warn('上传API必须存在并且是一个函数');
      }
      try {
        item.status = UploadResultStatus.UPLOADING;
        const { data } = await api?.(
          {
            data: {
              ...(props.uploadParams || {}),
            },
            biz: props.bizPath,
            file: item.file,
            name: props.name,
            filename: props.filename,
          },
          function onUploadProgress(progressEvent) {
            const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            item.percent = complete;
          },
        );
        item.status = UploadResultStatus.SUCCESS;
        item.responseData = data;
        return {
          success: true,
          error: null,
        };
      } catch (e) {
        item.status = UploadResultStatus.ERROR;
        return {
          success: false,
          error: e,
        };
      }
    }

    // 开始上传
    async function handleStartUpload() {
      const { maxCount } = props;
      if (fileListRef.value.length > maxCount) {
        return createMessage.fail(`最多只能上传${maxCount}个文件`);
      }

      try {
        isUploadingRef.value = true;
        // 只上传不是成功状态的
        const uploadFileList =
          fileListRef.value.filter((item) => item.status !== UploadResultStatus.SUCCESS) || [];
        const data = await Promise.all(
          uploadFileList.map((item) => {
            return uploadApiByItem(item);
          }),
        );
        isUploadingRef.value = false;
        const errorList = data.filter((item) => !item.success);
        // 生产环境:抛出错误
        if (errorList.length > 0) throw errorList;
      } catch (e) {
        isUploadingRef.value = false;
        throw e;
      }
    }

    const oversize = (file) => {
      console.log(file);
    };

    return {
      afterRead,
      beforeRead,
      oversize,
      getBindValue,
      fileListRef,
      handleClick,
      handleChange,
      beforeDelete,
    };
  },
};
</script>

<style>
</style>