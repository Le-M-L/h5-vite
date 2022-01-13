import { usePermissionStore } from '@/store/modules/permission';

// 用户权限 按钮权限
export function usePermission() {
  const permissionStore = usePermissionStore();

  function hasPermission(value, def = true) {
    if (!value) {
      return def;
    }
    let allPermissionList = [];
    // 全局页面权限
    let allAuthList = permissionStore.getAllAuth;
    for (let gauth of allAuthList) {
      if (gauth.type != '2') {
        allPermissionList.push(gauth);
      }
    }

    //设置全局配置是否有命中
    let invalidFlag = false; //无效命中
    if (allPermissionList.length > 0) {
      for (let itemG of allPermissionList) {
        if (value === itemG.action) {
          if (itemG.status == '0') {
            invalidFlag = true;
            break;
          }
        }
      }
    }
    if (invalidFlag) {
      return def;
    }

    let permissionList = [];
    let authList = permissionStore.getAuth;
    for (let auth of authList) {
      if (auth.type != '2') {
        permissionList.push(auth);
      }
    }
    let permissions = [];
    for (let item of permissionList) {
      //权限策略1显示2禁用
      if (item.type != '2') {
        //按钮权限，授权标识的提示信息是多个用逗号分隔逻辑处理 gitee#I1OUGU-------
        if (item.action) {
          if (item.action.includes(",")) {
            let split = item.action.split(",")
            for (let i = 0; i < split.length; i++) {
              if (!split[i] || split[i].length == 0) {
                continue;
              }
              permissions.push(split[i]);
            }
          } else {
            permissions.push(item.action);
          }
        }
        //按钮权限，授权标识的提示信息是多个用逗号分隔逻辑处理 gitee#I1OUGU------
      }
    }

    if (permissions.includes(value)) {
      return def;
    }
  }

  return {
    hasPermission,
  };
}
