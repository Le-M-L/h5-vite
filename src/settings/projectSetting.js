import {PermissionModeEnum, RouterTransitionEnum } from '@/enums/appEnum';

// 修改后需要清空浏览器缓存
const setting = {
  // 权限模式
  permissionMode: PermissionModeEnum.BACK,

  // 过度设置
  transitionSetting: {
    // 是否打开页面切换动画
    // 禁用状态也将禁用pageLoadinng
    enable: true,

    // 路由基本切换动画
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // 是否打开页面切换加载
    // 仅在 enable=true
    openPageLoading: true,

    // 是否打开顶部进度条
    openNProgress: false,
  },
};

export default setting;
