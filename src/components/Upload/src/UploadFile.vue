<template>
  <div class="baseFile">
    <span @click="handleClick">添加附件</span>
    <div class="previewItem" v-for="(item, i) in fileListRef" :key="i">
      <img src="./attachment_fill.png" alt="" />
      <div class="previewItem-content">
        <div class="previewItem-content-name">{{ item.name }}</div>
        <div class="previewItem-content-size">1.6MB</div>
      </div>
      <div class="previewItem-right"
        ><Icon @click="handleClear(item, i)" name="clear" size="16" color="#999" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, unref, toRefs, watch, nextTick, h } from 'vue';
import { Uploader, Button, Icon } from 'vant';
import { useUploadType } from './useUpload';
import { basicProps } from './props';
import { useMessage } from '@/hooks/web/useMessage';
import { checkFileType } from './helper';
import { omit } from 'lodash-es';
import { UploadResultStatus } from './typing';
import { isArray, isFunction } from '@/utils/is';
import { warn } from '@/utils/log';
import { initFileListArr, getFileAccessHttpUrl } from '@/utils';
import { uploadFile } from '@/api/sys/upload';
export default {
  name: 'BasicUpload',
  components: { Uploader, Button, Icon },
  inheritAttrs: false,
  props: {
    ...basicProps,
    api: {
      type: Function,
      default: uploadFile,
    },
  },
  emits: ['change', 'delete'],
  setup(props, { emit, attrs }) {
    //   是否正在上传
    const isUploadingRef = ref(false);
    const fileListRef = ref([]);
    const inputRef = ref(null);

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
        ...attrs,
        ...props,
      };
      return omit(value, ['modelValue', 'maxSize', 'api']);
    });

    watch(
      () => props.modelValue,
      (value = []) => {
        // 如果存在上传失败的文件  会自动清空
        fileListRef.value = isArray(unref(value))
          ? initFileListArr(unref(value))
          : initFileListArr(unref(value).split(','));
      },
      { immediate: true },
    );

    // 获取已上传的文件
    function getFileData() {
      return unref(fileListRef)
        .filter(({ status }) => status === UploadResultStatus.SUCCESS)
        .map(({ responseData }) => responseData.fileAccessPath);
    }

    const beforeDelete = (file) => {
      nextTick(() => {
        emit('change', getFileData().join());
      });
      return true;
    };

    // 文件大小读取
    function returnFileSize(number) {
      if (number < 1024) {
        return number + 'bytes';
      } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
      } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
      }
    }

    const handleClick = () => {
      let Input = document.createElement('input');
      Input.type = 'file';
      Input.accept = props.accept;
      Input.capture = props.capture;
      Input.multiple = props.multiple;
      Input.disabled = props.disabled;
      Input.onchange = handleChange;
      Input.click();
    };

    async function handleChange({ target }) {
      let files = target.files;
      if (!files.length) return;
      let count = fileListRef.value.length + files.length;
      // 限制文件上传数量
      if (count > maxCount) {
        return createMessage.fail(`最多只能上传${maxCount}个文件`);
      }

      // 判断文件大小 类型 等等 上传前调用
      let fileRead = await beforeRead(files);
      if (!fileRead) return;
      // 文件上传
      await afterRead();
      // 上传完成 释放自己
      target.remove();

      // 将数据回传给父级
      emit('change', getFileData().join());
    }

    // 文件上传前调用
    function beforeRead(file) {
      const { maxSize } = props;
      const accept = unref(getAccept);
      let files = [...file];
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
        let fileItem = {
          status: UploadResultStatus.UPLOADING, // 设置文件加载状态
          percent: 0, // 设置进度条状态
          file: files[i],
        };
        fileListRef.value.push(fileItem);
      }
      return true;
    }

    // 文件选择完成后调用
    async function afterRead() {
      const { autoUpload } = props;
      autoUpload && (await handleStartUpload());
      fileListRef.value = fileListRef.value.filter(
        ({ status }) => status === UploadResultStatus.SUCCESS,
      );
    }

    // 开始上传
    async function handleStartUpload() {
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

    // 上传
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
            biz: props.bizPath || 'temp',
            file: item.file,
            name: props.name,
            filename: props.filename,
          },
          function onUploadProgress(progressEvent) {
            const complete = ((progressEvent.loaded / progressEvent.total) * 100) | 0;
            item.percent = complete;
          },
        );
        data.fileAccessPath = data.message;
        item.status = UploadResultStatus.SUCCESS;
        item.responseData = data;
        item.url = getFileAccessHttpUrl(data.fileAccessPath);
        item.name = item.file.name;
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

    // 清空
    const handleClear = (item, i) => {
      fileListRef.value.splice(i, 1);
      beforeDelete();
    };

    return {
      afterRead,
      beforeRead,
      getBindValue,
      fileListRef,
      uploadFile,
      handleClick,
      handleChange,
      inputRef,
      handleClear,
    };
  },
};
</script>

<style lang="less" >
.baseFile {
  width: 100%;
  > span {
    color: #2f54eb;
    font-size: 16px;
  }
  .previewItem {
    margin-top: 8px;
    height: 52px;
    width: 100%;
    padding: 6px 9px;
    background: #f6f7f9;
    border-radius: 2px;
    box-sizing: border-box;
    display: flex;
    > img {
      width: 36px;
      height: 36px;
      margin-right: 8px;
    }
    &-content {
      width: calc(100% - 65px);
      color: #333333;
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: space-around;
      flex: 1;
      &-name{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &-size {
        color: #999;
        font-size: 12px;
      }
    }
    &-right {
      display: flex;
      align-items: center;
      padding-right: 12px;
    }
  }
  .previewItem + .previewItem {
    margin-top: 12px;
  }
}
</style>