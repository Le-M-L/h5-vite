import { unref } from "vue"
import { dateUtil } from '@/utils/dateUtil';
import { isArray, isFunction, isObject, isString, isNullOrUnDef } from '@/utils/is';
import { set } from 'lodash-es';

export function useTableValues({ getProps, getSchema, formModel }) {
  // 格式化数据
  function handleFormValues(values, items) {
    if (!isObject(values)) {
      return {};
    }
    const res = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }

      // Remove spaces
      if (isString(value)) {
        value = value.trim();
      }
      
      if (items.component == 'DCalendar' && items.mode == 'single' ) {
        value = value.join()
      }
      set(res, key, value);
    }
    return handleRangeTimeValue(res);
  }

  /**
   * 格式化日期
   */
  function handleRangeTimeValue(values){
    const fieldMapToTime = unref(getProps).fieldMapToTime;
    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values;
    }
    for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey || !values[field]) {
        continue;
      }

      const [startTime, endTime] = values[field];

      values[startTimeKey] = dateUtil(startTime).format(format);
      values[endTimeKey] = dateUtil(endTime).format(format);
      Reflect.deleteProperty(values, field);
    }
    return values;
  }

  return { handleFormValues };
}
