import { defineStore } from 'pinia';
import { store } from '@/store';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { doLogout, getUserInfo, loginApi } from '@/api/sys/user';

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
  }),
  getters: {
    getUserInfo() {
      return this.userInfo || getAuthCache(USER_INFO_KEY) || {};
    },
    getToken() {
      return this.token || getAuthCache(TOKEN_KEY);
    },
    getRoleList() {
      return this.roleList.length > 0 ? this.roleList : getAuthCache(ROLES_KEY);
    },
    getSessionTimeout() {
      return !!this.sessionTimeout;
    },
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
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    // 登录之后操作
    async afterLoginAction(goHome) {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      const { roles = [] } = userInfo;
      if (isArray(roles)) {
        const roleList = roles.map((item) => item.value);
        this.setRoleList(roleList);
      } else {
        userInfo.roles = [];
        this.setRoleList([]);
      }
      this.setUserInfo(userInfo);
      return userInfo;
    },
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
