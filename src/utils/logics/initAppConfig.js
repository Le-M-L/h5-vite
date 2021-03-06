// 应用配置

import { useAppStore } from '@/store/modules/app';
import { useOnlineStoreWithOut } from '@/store/modules/online';
import { PROJ_CFG_KEY, ONLINE_CFG_KEY } from '@/enums/cacheEnum';
import { deepMerge } from '@/utils';
// 缓存
import { Persistent } from '@/utils/cache/persistent';
// 项目最初配置
import projectSetting from '@/settings/projectSetting';
import { getCommonStoragePrefix, getStorageShortName } from '@/utils/env';

import './flexible'

// 最初的项目配置
export function initAppConfigStore() {
    const appStore = useAppStore();
    const onlineStore = useOnlineStoreWithOut();
    // 读取本地缓存
    let projCfg = Persistent.getLocal(PROJ_CFG_KEY);
    let onlineCfg = Persistent.getLocal(ONLINE_CFG_KEY);
    // 使用缓存覆盖项目最初配置
    projCfg = deepMerge(projectSetting, projCfg || {});
    // 将缓存 存到内存
    appStore.setProjectConfig(projCfg);
    onlineStore.setOnlineCfg(onlineCfg)
    // 清理本地缓存
    setTimeout(() => {
        clearObsoleteStorage();
    }, 16);
}


/**
 * 随着版本的继续迭代，将有越来越多的缓存键存储在localStorage中。
 * 删除无用的缓存
 */
 export function clearObsoleteStorage () {
    const commonPrefix = getCommonStoragePrefix();
    const shortPrefix = getStorageShortName();

    [localStorage, sessionStorage].forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (key && key.startsWith(commonPrefix) && !key.startsWith(shortPrefix)) {
                item.removeItem(key);
            }
        });
    });
}
