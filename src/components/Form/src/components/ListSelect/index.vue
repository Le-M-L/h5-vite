<template>
  <Field
    v-bind="getAttrs"
    disabled
    :class="{ isDisabled: state }"
    @clear="handleClear"
    v-model="state"
    @click="handlePopup"
  />

  <List v-model="state" @register="register" @row-click="handleClick" />
</template>

<script>
import { computed, ref, unref } from 'vue';
import { Popup, Field } from 'vant';
import { get, omit } from 'lodash-es';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { List, useList } from '../List';
import { getPopupColumns, getPopupListData, getPopupQuery } from '@/api/sys/api';
import { formatSchemas } from './hooks/handle';

export default {
  name: 'ListSelect',
  inheritAttrs: false,
  components: {
    Popup,
    Field,
    List,
  },
  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const [state] = useRuleFormItem(props);

    const [register, { handlePopup, setProps }] = useList();

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    const getBindValue = computed(() => {
      return {
        ...omit(attrs, 'inputProps'),
      };
    });

    // 获取选中的值
    function getCheckParams(checkArr) {
      // let field = getBindValue.value?.formValues.field;
      let schema = getBindValue.value?.formValues.schema;
      let tempCkeckArr = checkArr;
      let orgFields = schema.orgFields.split(',');
      let destFields = schema.destFields.split(',');
      // let index = destFields.indexOf(field);
      let params = {};
      // let showText = {};
      for (let i = 0; i < orgFields.length; i++) {
        let data = [];
        tempCkeckArr.forEach((item) => {
          let val = item[orgFields[i]];
          if (typeof val == 'undefined' || val == null || val.toString() == '') {
            val = '';
          }
          data.push(val);
        });
        params[destFields[i]] = data.join(',');
        // showText[orgFields[i]] = data.join(',');
      }
      // const fieldName = showText[orgFields[index]];

      return {
        params,
        // fieldName,
      };
    }

    // const getState = computed(() => )

    const handleClick = (item, { checkArr, checkIds }) => {
      let { params } = getCheckParams(checkArr);
      emit('change', null, {
        ...params,
        flag: 'map',
      });
    };

    // 获取列表配置
    getPopupColumns(unref(getAttrs).code).then(({ cgRpConfigId, columns = [], dictOptions }) => {
      setProps({
        columns: columns.slice(0, 3),
        dictOptions: dictOptions,
        api: (params) => getPopupListData(cgRpConfigId, params),
      });
      // 获取查询条件配置
      getPopupQuery(cgRpConfigId).then((res = []) => {
        setProps({
          queryColumns: formatSchemas(res.slice(0, 2), dictOptions),
        });
      });
    });

    // 清空数据
    const handleClear = () => {};

    return {
      state,
      getAttrs,
      getBindValue,
      handlePopup,
      handleClear,
      register,
      handleClick,
    };
  },
};
</script>
