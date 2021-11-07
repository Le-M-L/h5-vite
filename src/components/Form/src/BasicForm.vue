<template>
  <Form v-bind="getBindValue">
    <CellGroup v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <!-- <FormItem
          :tableAction="tableAction"
          :formActionType="formActionType"
          :schema="schema"
          :formProps="getProps"
          :allDefaultValues="defaultValueRef"
          :formModel="formModel"
          :setFormModel="setFormModel"
        >
          <template #[item]="data" v-for="item in Object.keys($slots)">
            <slot :name="item" v-bind="data || {}"></slot>
          </template>
        </FormItem> -->
      </template>
    </CellGroup>
    <van-button round block type="primary" native-type="submit"> 提交 </van-button>
  </Form>
</template>

<script>
import { ref, unref, computed } from 'vue';
import FormItem from './components/FormItem.vue';
import { dateUtil } from '@/utils/dateUtil';
import { dateItemType } from './helper';
import { basicProps } from './props';
import { CellGroup, Cell, Field, Form } from 'vant';
export default {
  components: {
    Form,
    CellGroup,
    FormItem,
  },
  props: basicProps,
  emits: ['advanced-change', 'reset', 'submit', 'register'],
  setup(props, { attrs, emit }) {
    const propsRef = ref({});
    const schemaRef = ref(null);

    // 获取表单的基本配置
    const getProps = computed(() => {
      return { ...props, ...unref(propsRef) };
    });

    // 为整个表单获取统一的行样式和行配置
    const getRow = computed(() => {
      const { baseRowStyle = {}, rowProps } = unref(getProps);
      return {
        style: baseRowStyle,
        ...rowProps,
      };
    });

    // props
    const getBindValue = computed(() => ({ ...attrs, ...props, ...unref(getProps) }));

    const getSchema = computed(() => {
      const schemas = unref(schemaRef) || unref(getProps).schemas;
      for (const schema of schemas) {
        const { defaultValue, component } = schema;
        // 操作时间类型
        if (defaultValue && dateItemType.includes(component)) {
          if (!Array.isArray(defaultValue)) {
            schema.defaultValue = dateUtil(defaultValue);
          } else {
            const def = [];
            defaultValue.forEach((item) => {
              def.push(dateUtil(item));
            });
            schema.defaultValue = def;
          }
        }
      }
      if (unref(getProps).showAdvancedButton) {
        return schemas.filter((schema) => schema.component !== 'Divider');
      } else {
        return schemas;
      }
    });

    return {
      getRow,
      getSchema,
      getBindValue,
    };
  },
};
</script>

<style>
</style>