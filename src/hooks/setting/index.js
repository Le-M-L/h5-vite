import { warn } from '@/utils/log';
import { getAppEnvConfig } from '@/utils/env';
// 获取全局变量设置
export const useGlobSetting = () => {
  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  } = getAppEnvConfig();

  if (!/[a-zA-Z\_]*/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }
  console.log(VITE_GLOB_API_URL)
  // 采取全局配置
  const glob = {
    title: VITE_GLOB_APP_TITLE,
    apiUrl: VITE_GLOB_API_URL,
    shortName: VITE_GLOB_APP_SHORT_NAME,
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    uploadUrl: VITE_GLOB_UPLOAD_URL,
    staticDomainURL:VITE_GLOB_API_URL + '/sys/common/static', // 静态文件路径
  };
  return glob;
};
