import { toRaw } from "vue"
import { defineStore } from 'pinia';
import { store } from '@/store';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import projectSetting from '@/settings/projectSetting';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { queryPermissionsByUser } from '@/api/sys/api';
import { useMessage } from "@/hooks/web/useMessage"
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import { transformObjToRoute, flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { filter } from '@/utils/helper/treeHelper';

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
    async buildRoutesAction(){
      const userStore = useUserStore();
      const appStore = useAppStoreWithOut();

      let routes = [];
      const roleList = toRaw(userStore.getRoleList) || [];
      const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

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
            content:  '菜单加载中...',
            duration: 1,
          });

          // 从后台获取权限代码
          // 这个函数可能只需要执行一次，并且实际的项目可以自己在正确的时间放置
          let routeList = [];
          try {
              // 获取按钮权限
            // this.changePermissionCode();
            // 获取菜单
            let { allAuth, auto, menu } = (await queryPermissionsByUser());
            routeList = menu.filter(item => item.name == 'db_platform');
            console.log(routeList)
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
        
          // 将多级路由转换为二级路由
          routeList = flatMultiLevelRoutes(routeList);
          routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
          console.log(routes)


      /**
       * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
       * */
    //   const patchHomeAffix = (routes) => {
    //     if (!routes || routes.length === 0) return;
    //     let homePath = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
    //     function patcher(routes, parentPath = '') {
    //       if (parentPath) parentPath = parentPath + '/';
    //       routes.forEach((route) => {
    //         const { path, children, redirect } = route;
    //         const currentPath = path.startsWith('/') ? path : parentPath + path;
    //         if (currentPath === homePath) {
    //           if (redirect) {
    //             homePath = route.redirect;
    //           } else {
    //             route.meta = Object.assign({}, route.meta, { affix: true });
    //             throw new Error('end');
    //           }
    //         }
    //         children && children.length > 0 && patcher(children, currentPath);
    //       });
    //     }
    //     try {
    //       patcher(routes);
    //     } catch (e) {
    //       // 已处理完毕跳出循环
    //     }
    //     return;
    //   };

    //   switch (permissionMode) {
    //       // 角色权限
    //     case PermissionModeEnum.ROLE:
    //       routes = filter(asyncRoutes, routeFilter);
    //       routes = routes.filter(routeFilter);
    //       // Convert multi-level routing to level 2 routing
    //       routes = flatMultiLevelRoutes(routes);
    //       break;

    //     case PermissionModeEnum.ROUTE_MAPPING:
    //       routes = filter(asyncRoutes, routeFilter);
    //       routes = routes.filter(routeFilter);
    //       const menuList = transformRouteToMenu(routes, true);
    //       routes = filter(routes, routeRemoveIgnoreFilter);
    //       routes = routes.filter(routeRemoveIgnoreFilter);
    //       menuList.sort((a, b) => {
    //         return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
    //       });

    //       this.setFrontMenuList(menuList);
    //       // Convert multi-level routing to level 2 routing
    //       routes = flatMultiLevelRoutes(routes);
    //       break;

    //     //  动态路由权限
    //     case PermissionModeEnum.BACK:
    //       const { createMessage } = useMessage();

    //       createMessage.loading({
    //         content:  '菜单加载中...',
    //         duration: 1,
    //       });

    //       // 从后台获取权限代码
    //       // 这个函数可能只需要执行一次，并且实际的项目可以自己在正确的时间放置
    //       let routeList = [];
    //       try {
    //           // 获取按钮权限
    //         // this.changePermissionCode();
    //         // 获取菜单
    //         routeList = (await getMenuList());
    //       } catch (error) {
    //         console.error(error);
    //       }

    //       // 动态引入组件
    //       routeList = transformObjToRoute(routeList);

    //       // 后台路由到菜单结构
    //       const backMenuList = transformRouteToMenu(routeList);
    //       this.setBackMenuList(backMenuList);

    //       // 删除需要忽略掉路由
    //       routeList = filter(routeList, routeRemoveIgnoreFilter);
    //       routeList = routeList.filter(routeRemoveIgnoreFilter);
        
    //       // 将多级路由转换为二级路由
    //       routeList = flatMultiLevelRoutes(routeList);
    //       routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
    //       break;
    //   }

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
