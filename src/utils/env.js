import { warn } from '@/utils/log';
import pkg from '../../package.json';

import { getConfigFileName } from '../../build/getConfigFileName';

// 版本key 前缀
export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_SHORT_NAME } = getAppEnvConfig();
  return `${VITE_GLOB_APP_SHORT_NAME}__${getEnv()}`.toUpperCase();
}

// 生产缓存key
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

export function getAppEnvConfig() {
  const ENV_NAME = getConfigFileName(import.meta.env);
  // 获取变量配置
  const ENV = import.meta.env.DEV ? import.meta.env : window[ENV_NAME];

  const {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  } = ENV;

  if (!/^[a-zA-Z\_]*$/.test(VITE_GLOB_APP_SHORT_NAME)) {
    warn(
      `VITE_GLOB_APP_SHORT_NAME Variables can only be characters/underscores, please modify in the environment variables and re-running.`,
    );
  }

  return {
    VITE_GLOB_APP_TITLE,
    VITE_GLOB_API_URL,
    VITE_GLOB_APP_SHORT_NAME,
    VITE_GLOB_API_URL_PREFIX,
    VITE_GLOB_UPLOAD_URL,
  };
}

/**
 * @description: 开发模式
 */
export const devMode = 'development';

/**
 * @description: 生成模式
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
export function getEnv() {
  return import.meta.env.MODE;
}

/**
 * @description: 是否为开发模式
 * @returns:
 * @example:
 */
export function isDevMode() {
  return import.meta.env.DEV;
}

/**
 * @description: 是否为生成模式
 * @returns:
 * @example:
 */
export function isProdMode() {
  return import.meta.env.PROD;
}
