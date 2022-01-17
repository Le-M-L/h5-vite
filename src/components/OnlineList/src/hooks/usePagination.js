import { computed } from "vue";

// 使用分页
export function usePagination(propsRef, { main, }) {
    const queryParam = ref({});
    const getRowData = computed(() => onlineStore.getDetailData);
    const isorter = reactive({ column: 'id', order: 'desc' });

    // 初始化 查询参数
    function initDependQueryParam() {
        const { tableType, foreignKeys } = main;
        if (3 == tableType) {
            if (!foreignKeys || 0 == foreignKeys.length) {
                // createMessage.fail(`子表【${description}】外键配置未找到!`);
                return false;
            }
            if (!getRowData.value) return false;
            for (let item of foreignKeys) {
                if (!getRowData.value[item.key] || 0 == getRowData.value[item.key].length) return false;
                let obj = Object.assign({}, unref(queryParam));
                obj[item.field] = getRowData.value[item.key];
                obj['tabletype'] = tableType;
                queryParam.value = Object.assign({}, obj, unref(isorter));
            }
        }
        return true;
    }

    const getPaginationInfo = computed(() => {

        return queryParam;
    })

}