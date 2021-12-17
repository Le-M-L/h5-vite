import { defHttp } from '@/utils/http/axios';

// 权限管理
// 获取用户权限 和 菜单
export function queryPermissionsByUser() {
  return defHttp.get({ url: '/sys/permission/getUserPermissionByToken' });
}

// 获取部门管理
export const queryDepartTreeList = (params) => {
  return defHttp.get({ url: '/sys/sysDepart/queryTreeList', params });
};

// 根据部门id查询部门完整信息
export const getDepartInfoById = (params) => {
  return defHttp.get({url:'/sys/sysDepart/getDepartByIdOrCode', params})
}