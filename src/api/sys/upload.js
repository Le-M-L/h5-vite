import { defHttp } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: 图片上传接口
 */
export function uploadApi(params, onUploadProgress) {
  return defHttp.uploadFile(
    {
      url: 'http://test.xmock.top/sys/common/uploadFileToFtp',
      onUploadProgress,
    },
    params,
  );
}

/**
 * 文件上传接口
 */
export function uploadFile(params,onUploadProgress){
  return defHttp.uploadFile(
    {
      url:'http://test.xmock.top/sys/common/upload',
      onUploadProgress
    },
    params
  )
}