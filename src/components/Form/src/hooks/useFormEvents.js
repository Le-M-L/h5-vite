import { unref, toRaw } from 'vue';
import { isArray, isFunction, isObject, isString } from '@/utils/is';
import { dateItemType, handleInputNumberValue } from '../helper';
import { dateUtil } from '@/utils/dateUtil';
import { cloneDeep, uniqBy } from 'lodash-es';
import { deepMerge } from '@/utils';
import { error } from '@/utils/log';

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
   * @description 插入某个字段之后，如果不是插入最后一个字段
   */

  async function appendSchemaByField(schema, prefixField, first = false) {
    const schemaList = cloneDeep(unref(getSchema));
    const index = schemaList.findIndex((schema) => schema.field === prefixField);
    const hasInList = schemaList.some((item) => item.field === prefixField || schema.field);
    if (!hasInList) return;

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schema) : schemaList.push(schema);
      schemaRef.value = schemaList;
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema);
    }
    schemaRef.value = schemaList;
  }

  async function resetSchema(data) {
    let updateData = [];
    if (isObject(data)) {
      updateData.push(data);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    const hasField = updateData.every(
      (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
    );
    if (!hasField) {
      error('需要更新的表单架构数组的所有子级都必须包含“field”字段');
      return;
    }
    schemaRef.value = updateData;
  }

  /**
   * @description 更新Schema
   */
  async function updateSchema(data) {
    let updateData = [];
    if (isObject(data)) {
      updateData.push(data);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    const hasField = updateData.every((item) => Reflect.has(item, 'field') && item.field);

    if (!hasField) {
      error('需要更新的表单架构数组的所有子级都必须包含“field”字段');

      return;
    }

    const schema = [];
    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (val.field === item.field) {
          const newSchema = deepMerge(val, item);
          schema.push(newSchema);
        } else {
          schema.push(val);
        }
      });
    });
    schemaRef.value = uniqBy(schema, 'field');
  }
  /**
   * @description 获取字段内容 value
   */
  function getFieldsValue() {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(toRaw(unref(formModel)));
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
   * @description: 验证表单
   * @param { string | string[] }
   */
   async function validateFields(nameList) {
    return unref(formElRef)?.validate(nameList);
  }

  /**
   * @description: 验证表单
   * @param { string | string[] }
   */
  async function validate(nameList) {
    return unref(formElRef)?.validate(nameList);
  }

  /**
   * @description 移除表单项的校验结果
   * @param { string ｜ string[] } name 表单字段名
   */
  async function clearValidate(name) {
    await unref(formElRef)?.resetValidation(name);
  }

  /**
   * @description 滚动到对应字段位置
   * @param { string } name
   * @param { boolean } options
   */
  async function scrollToField(name, options) {
    await unref(formElRef)?.scrollToField(name, options);
  }

  /**
   * @description: 表单提交
   */
  async function handleSubmit(e) {
    e && e.preventDefault();
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) return;
    try {
      const values = await validate();
      const res = handleFormValues(values);
      emit('submit', res);
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    resetFields,
    setFieldsValue,
    scrollToField,
  };
}
