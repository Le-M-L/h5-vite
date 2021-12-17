import { defHttp } from '@/utils/http/axios';
import { useGlobSetting } from '@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();

/**
 * @description: 上传接口
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
