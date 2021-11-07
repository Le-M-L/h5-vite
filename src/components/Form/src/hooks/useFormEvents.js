import { unref, toRaw } from 'vue';
import { isArray, isFunction, isObject, isString } from '@/utils/is';
import { dateItemType, handleInputNumberValue } from '../helper';
import { dateUtil } from '@/utils/dateUtil';
import { cloneDeep, uniqBy } from 'lodash-es';
export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
}) {
  /**
   * @description: 重置表单
   */
  async function resetFields() {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) return;

    Object.keys(formModel).forEach((key) => {
      formModel[key] = defaultValueRef.value[key];
    });
    clearValidate();
    emit('reset', toRaw(formModel));
    submitOnReset && handleSubmit();
  }

  /**
   * @description: set form value
   */

  async function setFieldsValue(values) {
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean);

    const validKeys = [];

    Object.keys(values).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      let value = values[key];

      const hasKey = Reflect.has(values, key);
      value = handleInputNumberValue(schema?.component, value);
      // 0| '' is allow
      if (hasKey && fields.includes(key)) {
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(value)) {
            const arr = [];

            for (const ele of value) {
              arr.push(ele ? dateUtil(ele) : null);
            }
            formModel[key] = arr;
          } else {
            const { componentProps } = schema || {};
            let _props = componentProps;
            if (typeof componentProps === 'function') {
              _props = _props({ formModel });
            }
            formModel[key] = value ? (_props?.valueFormat ? value : dateUtil(value)) : null;
          }
        } else {
          formModel[key] = value;
        }
        validKeys.push(key);
      }
    });
    validate(validKeys).catch((_) => {});
  }

  /**
   * @description: 根据字段名进行删除
   */
  async function removeSchemaByFiled(fields) {
    const schemaList = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }

    let fieldList = isString(fields) ? [fields] : fields;
    // if (isString(fields)) {
    //   fieldList = [fields];
    // }
    for (const field of fieldList) {
      _removeSchemaByFiled(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

   /**
   * @description: 根据字段名进行删除
   */
    function _removeSchemaByFiled(field, schemaList) {
        if (isString(field)) {
          const index = schemaList.findIndex((schema) => schema.field === field);
          if (index !== -1) {
            delete formModel[field];
            schemaList.splice(index, 1);
          }
        }
      }


  /**
   * @description: Is it time
   */
  function itemIsDateType(key) {
    return unref(getSchema).some((item) => {
      return item.field === key ? dateItemType.includes(item.component) : false;
    });
  }

  /**
   * @description: 触发表单校验
   */
  async function validate(nameList) {
    return unref(formElRef)?.validate(nameList);
  }
}
