import { defHttp } from '@/utils/http/axios';

// 权限管理
// 获取用户权限 和 菜单
export function queryPermissionsByUser() {
  return defHttp.get({ url: '/sys/permission/getUserPermissionByToken' });
}

// 获取APP权限
// 获取用户APP 相关权限 和 菜单
export function queryPermissionsByUserApp() {
  return defHttp.get({ url: '/sys/permission/getUserPermissionByToken?name=移动端' });
}

// 获取部门管理
export const queryDepartTreeList = (params) => {
  return defHttp.get({ url: '/sys/sysDepart/queryTreeList', params });
};

// 根据部门id查询部门完整信息
export const getDepartInfoById = (params) => {
  return defHttp.get({url:'/sys/sysDepart/getDepartByIdOrCode', params})
}
// 返回所有部门 平级 信息
export const getAllDepartInfo = (params) => defHttp.get({url:'/sys/sysDepart/getDepartList', params})



// 在线表单 列表配置 接口
export const getListColumns = params => {
  return defHttp.get({url:`/online/cgform/api/getColumns/${params.code}`})
}
// 在线表单 列表数据 接口
export const getListData = (code,params) => {
  return defHttp.get({url:`/online/cgform/api/getData/${code}`,params})
}
// 在线表单 列表查询 配置获取
export const getQueryColumns = (code,params) => {
  return defHttp.get({url:`/online/cgform/api/getQueryInfo/${code}`,params})
}

// 在线表单 erp列表配置 接口
export const getErpColumns = params => {
  return defHttp.get({url:`/online/cgform/api/getErpColumns/${params.code}`})
}

// 在线表单  表单项配置 接口
export const getOnlineFormItem = params => {
  return defHttp.get({url:`/online/cgform/api/getErpFormItem/${params.code}`})
}

