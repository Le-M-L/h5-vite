
import { defHttp } from '@/utils/http/axios';
// import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';


const Api = {
  Login: '/sys/mLogin',
  Logout: '/logout',
  GetUserInfo: '/getUserInfo',
  GetPermCode: '/getPermCode',
};

/**
 * @description: 用户登陆 api
 */
export function loginApi(params, mode = 'modal') {
  return defHttp.post(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
