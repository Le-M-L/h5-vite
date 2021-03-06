import { defineStore } from 'pinia';
import { store } from '@/store';

import { formatToDateTime } from '@/utils/dateUtil';
import projectSetting from '@/settings/projectSetting';
import { ErrorTypeEnum } from '@/enums/exceptionEnum';

export const useErrorLogStore = defineStore({
    id: 'app-error-log',
    state: () => ({
        errorLogInfoList: null,
        errorLogListCount: 0,
    }),
    getters: {
        getErrorLogInfoList() {
            return this.errorLogInfoList || [];
        },
        getErrorLogListCount() {
            return this.errorLogListCount;
        },
    },
    actions: {
        addErrorLogInfo(info) {
            const item = {
                ...info,
                time: formatToDateTime(new Date()),
            };
            this.errorLogInfoList = [item, ...(this.errorLogInfoList || [])];
            this.errorLogListCount += 1;
        },
        setErrorLogListCount(count) {
            this.errorLogListCount = count;
        },
        /**
         * ajax请求错误后触发
         * @param error
         * @returns
         */
        addAjaxErrorInfo(error) {
            const { useErrorHandle } = projectSetting;
            if (!useErrorHandle) {
                return;
            }
            const errInfo = {
                message: error.message,
                type: ErrorTypeEnum.AJAX,
            };
            if (error.response) {
                const { config: { url = '', data: params = '', method = 'get', headers = {} } = {}, data = {} } =
                    error.response;
                errInfo.url = url;
                errInfo.name = 'Ajax Error!';
                errInfo.file = '-';
                errInfo.stack = JSON.stringify(data);
                errInfo.detail = JSON.stringify({ params, method, headers });
            }
            this.addErrorLogInfo(errInfo);
        },
    },
});
// 需要在设置之外使用
export function useErrorLogStoreWithOut() {
    return useErrorLogStore(store);
}
