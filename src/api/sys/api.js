import { defHttp, objectToQuery } from '@/utils/http/axios';

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
  return defHttp.get({ url: '/sys/sysDepart/getDepartByIdOrCode', params });
};
// 返回所有部门 平级 信息
export const getAllDepartInfo = (params) =>
  defHttp.get({ url: '/sys/sysDepart/getDepartList', params });

// 在线表单 列表配置 接口
export const getListColumns = (code, params) => {
  return defHttp.get({ url: `/online/cgform/api/getColumns/${code}`, params });
};
// 在线表单 列表数据 接口
export const getListData = (code, params) => {
  return defHttp.get({ url: `/online/cgform/api/getData/${code}`, params });
};
// 在线表单 列表查询 配置获取
export const getQueryColumns = (code, params) => {
  return defHttp.get({ url: `/online/cgform/api/getQueryInfo/${code}`, params });
};

// 在线表单 erp列表配置 接口
export const getErpColumns = (code, params) => {
  return defHttp.get({ url: `/online/cgform/api/getErpColumns/${code}`, params });
};

// 在线表单 erp表单项配置 接口
export const getOnlineFormItem = (code, params) => {
  return defHttp.get({ url: `/online/cgform/api/getErpFormItem/${code}`, params });
};

// 在线表单 详情 接口
export const getOnlineDetail = (code, id, params) => {
  return defHttp.get({ url: `/online/cgform/api/form/${code}/${id}`, params });
};

// tableType == 1 为单 否者为多
// 在线表单开发 保存 接口  返回值为当前保存的ID
export const saveOnlineData = (code, tabletype, params) => {
  return defHttp.post({ url: `/online/cgform/api/form/${code}?tabletype=${tabletype}`, params });
};
export const updateOnlineData = (code, tabletype, params) => {
  return defHttp.put({ url: `/online/cgform/api/form/${code}?tabletype=${tabletype}`, params });
}
// 弹窗列表 列表配置获取
export const getPopupColumns = (code, params) => {
  return defHttp.get({ url: `/online/cgreport/api/getRpColumns/${code}`, params });
};

// 弹窗列表 数据获取
export const getPopupListData = (code, params) => {
  return defHttp.get({ url: `/online/cgreport/api/getData/${code}`, params });
};

// 弹窗列表 查询配置获取
export const getPopupQuery = (code, params) => {
  return defHttp.get({ url: `/online/cgreport/api/getQueryInfo/${code}`, params });
};

// 弹窗列表 数据 和 配置
export const getPopupAllColumns = (code, params) => {
  return defHttp.get({ url: `/online/cgreport/api/getColumnsAndData${code}`, params });
};

// 获取部门对应的名称
export const getSysDepart = (params) => {
  return defHttp.get({ url: `/sys/sysDepart/getDepartList`, params });
};

// 通过部门查找对应下面的人
export const getDepartByUser  = (params) => {
  return new Promise(async (r) => {
    let data =await defHttp.get({ url: `/sys/user/queryUserComponentData`, params })
    r(data.records)
  });
}

// 根据id 获取选中人的信息
// isReturnNativeResponse: true 直接返回结果
export const getMultiUser = (params) => {
  return defHttp.get({ url: `/sys/user/getMultiUser`, params },{ isReturnNativeResponse: true },);
  
}