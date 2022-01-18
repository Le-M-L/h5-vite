import { toRaw } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { queryPermissionsByUserApp } from '@/api/sys/api';
import { useMessage } from '@/hooks/web/useMessage';
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import { transformObjToRoute, flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { filter } from '@/utils/helper/treeHelper';
import { BUTTON_AUTH_KEY } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: () => ({
    permCodeList: [],
    // 是否已动态添加路由
    isDynamicAddedRoute: false,
    // 触发菜单更新时间
    lastBuildMenuTime: 0,
    // 后台菜单列表
    backMenuList: [],
    // 菜单列表
    frontMenuList: [],
    buttonAuth: {
      allAuth: [],
      auth: [],
    },
  }),
  getters: {
    // 按钮权限列表
    getPermCodeList() {
      return this.permCodeList;
    },
    // 获取后台菜单列表
    getBackMenuList() {
      return this.backMenuList;
    },
    // 获取菜单列表
    getFrontMenuList() {
      return this.frontMenuList;
    },
    // 获取最后彩蛋更新时间
    getLastBuildMenuTime() {
      return this.lastBuildMenuTime;
    },
    // 获取是否已动态添加路由
    getIsDynamicAddedRoute() {
      return this.isDynamicAddedRoute;
    },
    // 获取所有权限按钮
    getAllAuth() {
      return this.buttonAuth.allAuth
    },
    // 获取按钮权限
    getAuth(){
      return this.buttonAuth.auth
    }
  },
  actions: {
    setPermCodeList(codeList) {
      this.permCodeList = codeList;
    },
    // 设置后台菜单列表
    setBackMenuList(list) {
      this.backMenuList = list;
      list?.length > 0 && this.setLastBuildMenuTime();
    },
    // 设置菜单列表
    setFrontMenuList(list) {
      this.frontMenuList = list;
    },
    // 设置菜单更新时间
    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },
    // 设置是否已动态添加路由
    setDynamicAddedRoute(added) {
      this.isDynamicAddedRoute = added;
    },
    // 设置按钮权限
    setButtonAuth({ allAuth, auth }) {
      this.buttonAuth.allAuth = allAuth;
      this.buttonAuth.auth = auth;
      Persistent.setLocal(BUTTON_AUTH_KEY, this.buttonAuth);
    },
    // 重置当前状态
    resetState() {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    // 改变权限code
    // async changePermissionCode() {
    //   const codeList = await getPermCode();
    //   this.setPermCodeList(codeList);
    // },
    // 打包路由操作
    async buildRoutesAction() {
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();
      let routes = [];
      const roleList = toRaw(userStore.getRoleList) || [];

      const routeFilter = (route) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };

      const routeRemoveIgnoreFilter = (route) => {
        const { meta } = route;
        const { ignoreRoute } = meta || {};
        return !ignoreRoute;
      };

      const { createMessage } = useMessage();

      createMessage.loading({
        content: '菜单加载中...',
        duration: 1,
      });

      // 从后台获取权限代码
      // 这个函数可能只需要执行一次，并且实际的项目可以自己在正确的时间放置
      let routeList = [];
      try {
        // 获取按钮权限
        // this.changePermissionCode();
        // 获取菜单
        // 用户按钮权限  auth
        // 系统按钮权限  allAuth
        let {
          allAuth,
          auth,
          menu: { children = [] },
        } = await queryPermissionsByUserApp();
        routeList = children;
        const newAllAuth = allAuth.filter(
          (item) => item.action && item.action.indexOf('mobile:') === 0,
        );
        const newAuth = auth.filter((item) => item.action && item.action.indexOf('mobile:') === 0);
        this.setButtonAuth({ allAuth: newAllAuth, auth: newAuth });
        // 设置部门 sys_org_code
        appStore.setSysDepart()

      } catch (error) {
        console.error(error);
      }
      // 动态引入组件
      routeList = transformObjToRoute(routeList);

      // 后台路由到菜单结构
      const backMenuList = transformRouteToMenu(routeList);
      
      this.setBackMenuList(backMenuList);

      // 删除需要忽略掉路由
      routeList = filter(routeList, routeRemoveIgnoreFilter);
      routeList = routeList.filter(routeRemoveIgnoreFilter);
      console.log(routeList);
      // 将多级路由转换为二级路由
      routeList = flatMultiLevelRoutes(routeList);
      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
    

      routes.push(ERROR_LOG_ROUTE);
      //   patchHomeAffix(routes);
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
