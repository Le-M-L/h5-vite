import { unref } from "vue"

// 对列表数据处理
export const useDataSource = ({ records, rawColumns, dictOptions }) => {
    let dd = unref(rawColumns).filter(item => item.customRender);
    console.log(dd)
    return records.reduce((prev,next) => {
        if (next) {
            prev
        }
    },[])
};
