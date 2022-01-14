import { defineStore } from 'pinia';
import { store } from '@/store';
import { router } from '@/router';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { doLogout, loginApi } from '@/api/sys/user';
import { getAllDepartInfo } from '@/api/sys/api';
import { usePermissionStore } from '@/store/modules/permission';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { PageEnum } from '@/enums/pageEnum';

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    // 用户信息
    userInfo: null,
    // token
    token: undefined,
    // 角色列表
    roleList: [],
    // 登录是否过期
    sessionTimeout: false,
    // 最后获取时间
    lastUpdateTime: 0,
    // 部门信息
    departInfo:{}
  }),
  getters: {
    // 获取用户信息
    getUserInfo() {
      return this.userInfo || getAuthCache(USER_INFO_KEY) || {};
    },
    // 获取token
    getToken() {
      return this.token || getAuthCache(TOKEN_KEY);
    },
    // 获取角色列表
    getRoleList() {
      return this.roleList.length > 0 ? this.roleList : getAuthCache(ROLES_KEY);
    },
    // 获取储存过期时间
    getSessionTimeout() {
      return !!this.sessionTimeout;
    },
    // 获取最后更新时间
    getLastUpdateTime() {
      return this.lastUpdateTime;
    },
  },
  actions: {
    // 设置token
    setToken(info) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    // 设置角色列表
    setRoleList(roleList) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    // 设置用户信息
    setUserInfo(info) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    // 设置登录过期
    setSessionTimeout(flag) {
      this.sessionTimeout = flag;
    },
    // 设置部门信息
    setDepartInfo(info){
      this.departInfo = info
    },
    // 初始化状态
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    // 用户登录
    async login(params) {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token , userInfo} = data;
        userInfo.homePath = '/sys/home'
        // save token
        this.setToken(token);
        // save userInfo
        this.setUserInfo(userInfo);
        // 设置部门信息
        const result = await getAllDepartInfo();
        const depInfo = {};
        result.map((item) => {
          depInfo[item.orgCode] = {
            value: item.orgCode,
            title: item.departName,
            text: item.departName,
            departId: item.id,
          };
        });
        // 设置部门信息
        this.setDepartInfo(depInfo);
        
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 登录之后操作 获取路由 获取部门
    async afterLoginAction(goHome) {
      if (!this.getToken) return null;
      const userInfo = this.getUserInfo;
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      }else {
        const permissionStore = usePermissionStore();
        // 如果没有完成异步路由更新 则重新获取路由
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();

          routes.forEach((route) => {
            router.addRoute(route);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    // async getUserInfoAction() {
    //   if (!this.getToken) return null;
    //   const userInfo = await getUserInfo();
    //   const { roles = [] } = userInfo;
    //   if (isArray(roles)) {
    //     const roleList = roles.map((item) => item.value);
    //     this.setRoleList(roleList);
    //   } else {
    //     userInfo.roles = [];
    //     this.setRoleList([]);
    //   }
    //   this.setUserInfo(userInfo);
    //   return userInfo;
    // },
    // 退出登录 -- 直接退出
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    // 弹窗退出
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      createConfirm({
        title: () => h('span', '温馨提醒'),
        content: () => h('span', '是否确认退出系统?'),
      }).then(async () => {
        await this.logout(true);
      });
    },
  },
});

// 需要在设置之外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
