import { configureDynamicParamsMenu } from '../helper/menuHelper';
import { PermissionModeEnum } from '@/enums/appEnum';
import { useAppStoreWithOut } from '@/store/modules/app';
import { usePermissionStoreWithOut } from '@/store/modules/permission';

export function createParamMenuGuard(router) {
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, _, next) => {
    // 筛选无名称路由
    if (!to.name) {
      next();
      return;
    }

    // 菜单已经建立
    if (!permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    let menus = [];
    if (isBackMode()) {
      menus = permissionStore.getBackMenuList;
    } else if (isRouteMappingMode()) {
      menus = permissionStore.getFrontMenuList;
    }
    menus.forEach((item) => configureDynamicParamsMenu(item, to.params));

    next();
  });
}

const getPermissionMode = () => {
  const appStore = useAppStoreWithOut();
  return appStore.getProjectConfig.permissionMode;
};

const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK;
};

const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};
