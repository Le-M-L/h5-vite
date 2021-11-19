// @ts-nocheck
import { useMessage } from '@/hooks/web/useMessage';
// import router from '@/router';
// import { PageEnum } from '@/config/enums/pageEnum';
import { useUserStoreWithOut } from '@/store/modules/user';
import projectSetting from '@/settings/projectSetting';
import { SessionTimeoutProcessingEnum } from '@/enums/appEnum';

const { createMessage, createAlertDialog } = useMessage();

const error = createMessage.fail;
const stp = projectSetting.sessionTimeoutProcessing;
export function checkStatus(status, msg, errorMessageMode) {
  const userStore = useUserStoreWithOut();
  let errMessage = '';

  switch (status) {
    case 400:
      errMessage = `${msg}`;
      break;
    // 401: 未登录
    // 如果未登录，则跳转到登录页面，并携带当前页面的路径
    // 登录成功后返回到当前页面。该步骤需要在登录界面进行操作。
    case 401:
      errMessage = '用户没有权限（令牌、用户名、密码错误）!';
      if (stp === SessionTimeoutProcessingEnum.PAGE_COVERAGE) {
        userStore.setToken(undefined);
        userStore.setSessionTimeout(true);
      } else {
        userStore.logout(true);
      }
      break;
    case 403:
      errMessage = '用户得到授权，但是访问是被禁止的。!';
      break;
    // 404请求不存在
    case 404:
      errMessage = '网络请求错误,未找到该资源!';
      break;
    case 405:
      errMessage = '网络请求错误,请求方法未允许!';
      break;
    case 408:
      errMessage = '网络请求超时!';
      break;
    case 500:
      errMessage = '服务器错误,请联系管理员!';
      break;
    case 501:
      errMessage = '网络未实现!';
      break;
    case 502:
      errMessage = '网络错误!';
      break;
    case 503:
      errMessage = '服务不可用，服务器暂时过载或维护!';
      break;
    case 504:
      errMessage = '网络超时!';
      break;
    case 505:
      errMessage = 'http版本不支持该请求!';
      break;
    case '1006':
      errMessage = `${msg}`;
      userStore.logout(true);
      break;
    default:
  }
  if (errMessage) {
    if (errorMessageMode === 'modal') {
      createAlertDialog({ title: '错误提示', content: errMessage });
    } else if (errorMessageMode === 'message') {
      error({
        content: errMessage,
        key: `global_error_message_status_${status}`,
      });
    }
  }
}
