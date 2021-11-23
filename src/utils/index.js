
import { useGlobSetting } from '@/hooks/setting';
import { isObject } from '@/utils/is';
import { buildUUID } from '@/utils/uuid';
import { UploadResultStatus } from '@/components/Upload/src/typing';
const { staticDomainURL } = useGlobSetting()

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
 export function setObjToUrlParams(baseUrl, obj) {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export const withInstall = (component, alias) => {
  const comp = component;
  comp.install = (app) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component;
};

// 对象深度合并
export function deepMerge(src = {}, target = {}) {
  let key;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}


export function getRawRoute(route) {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined,
  };
}

/**
 * @description:  设置ui挂载节点
 */
 export function getPopupContainer(node) {
  return node?.parentNode ?? document.body;
}

export function openWindow(url, opt) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}


export function getFileAccessHttpUrl(avatar,subStr) {
  if(!subStr) subStr = 'http'
  try {
    if(avatar && avatar.startsWith(subStr)){
      return avatar;
    }else{
      if(avatar &&　avatar.length>0 && avatar.indexOf('[')==-1){
        return staticDomainURL + "/" + avatar;
      }
    }
  }catch(err){
   return;
  }
}
/**
 * 对文件路径 初始化
 * @param {*} val 
 * @returns 
 */
export function initFileListArr(val) {
  let fileList = [];
  for (var a = 0; a < val.length; a++) {
    let url = getFileAccessHttpUrl(val[a]);
    fileList.push({
      uid: buildUUID(),
      // name: val[a],
      status: UploadResultStatus.SUCCESS,
      url: url,
      responseData: {
        status: true,
        message: val[a],
      },
    });
  }
  return fileList = fileList;
}