import { getParentLayout, LAYOUT, EXCEPTION_COMPONENT, PAGE_LAYOUT } from '@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import { warn } from '@/utils/log';
import { createRouter, createWebHashHistory } from 'vue-router';

const IFRAME = () => import('@/pages/sys/iframe/FrameBlank.vue');

const LayoutMap = new Map();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);
LayoutMap.set('PAGE_LAYOUT', PAGE_LAYOUT);

let dynamicViewsModules;
let onlineFrom = ['/online/cgformList','/online/cgformErpList']
// 动态引入
function asyncImportRoute(routes) {
  dynamicViewsModules = dynamicViewsModules || import.meta.glob('../../pages/**/*.{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    if (!item.component && item.meta?.frameSrc) {
      item.component = 'IFRAME';
    }
    if(item.component == 'layouts/RouteView'){
      item.component = 'PAGE_LAYOUT';
    }
    const { component, name, children, path, id } = item;
    let pathFlag = onlineFrom.some(i => path.startsWith(i));
    // 删除不需要的路由
    item.meta.ignoreRoute = item.meta?.ignoreRoute ?? pathFlag;
    item.meta.id = id;
    if (component) {
      const layoutFound = LayoutMap.get(component.toUpperCase());
      if (layoutFound) {
        // iframe
        item.component = layoutFound;
      } else {
        item.component =  dynamicImport(dynamicViewsModules, component);
      }
    } else if (name) {
      item.component = getParentLayout();
    }
    children && asyncImportRoute(children);

  });
}

// 动态引入路由 对路由地址转换
function dynamicImport(dynamicViewsModules, component) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../pages', '');
    const startFlag = component.startsWith('/');
    const endFlag = component.endsWith('.vue') || component.endsWith('.jsx');
    const startIndex = startFlag ? 0 : 1;
    const lastIndex = endFlag ? k.length : k.lastIndexOf('.');
    return k.substring(startIndex, lastIndex) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  } else if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.JSX` files with the same file name in the same hierarchical directory under the pages folder. This will cause dynamic introduction failure',
    );
    return;
  } else {
    warn('在src/pages/下找不到`' + component + '.vue` 或 `' + component + '.jsx`, 请自行创建!');
    return EXCEPTION_COMPONENT;
  }
}

// 将背景对象转换为路由对象
export function transformObjToRoute(routeList) {
  routeList.forEach((route) => {
    const component = route.component;
    if (component) {
      if (component.toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(component.toUpperCase());
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    } else {
      warn('请正确配置路由：' + route?.name + '的component属性');
    }
   
    route.children && asyncImportRoute(route.children);
  });
  return routeList;
}

/**
 * 将多级路由转换为二级路由
 */
export function flatMultiLevelRoutes(routeModules) {
  const modules = cloneDeep(routeModules);
  for (let index = 0; index < modules.length; index++) {
    const routeModule = modules[index];
    // 判断 路由是否超过二级    不超过二级 跳过本次操作
    if (!isMultipleRoute(routeModule)) {
      continue;
    }
    promoteRouteLevel(routeModule);
  }
  return modules;
}

// 路由等级提升
function promoteRouteLevel(routeModule) {
  // 使用vue-router来拼接菜单
  let router = createRouter({
    routes: [routeModule],
    history: createWebHashHistory(),
  });

  const routes = router.getRoutes();
  addToChildren(routes, routeModule.children || [], routeModule);
  router = null;
  // 二级转完 删除所有超过二级到路由
  routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

//  将所有子路由添加到 二级路由中
function addToChildren(routes, children, routeModule) {
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    const route = routes.find((item) => item.name === child.name);
    if (!route) {
      continue;
    }
    routeModule.children = routeModule.children || [];
    // 递归把所有子集转二级
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route);
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule);
    }
  }
}

// 判断级别是否超过2级
function isMultipleRoute(routeModule) {
  if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
    return false;
  }

  const children = routeModule.children;

  let flag = false;
  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (child.children?.length) {
      flag = true;
      break;
    }
  }
  return flag;
}
