<template>
  <Form v-bind="getBindValue" :class="getFormClass" ref="formElRef">
    <CellGroup v-bind="getRow">
      <slot name="formHeader"></slot>
      <template v-for="schema in getSchema" :key="schema.field">
        <FormItem
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
        </FormItem>
      </template>
    </CellGroup>
    <van-button round block type="primary" native-type="submit"> 提交 </van-button>
  </Form>
</template>

<script>
import { ref, reactive, unref, computed, onMounted, watch } from 'vue';
import FormItem from './components/FormItem.vue';
import { dateUtil } from '@/utils/dateUtil';
import { dateItemType } from './helper';
import { basicProps } from './props';
import { useDesign } from '@/hooks/web/useDesign';
import { CellGroup, Form } from 'vant';
import { useFormEvents } from './hooks/useFormEvents';
import { useFormValues } from './hooks/useFormValues';

export default {
  components: {
    Form,
    CellGroup,
    FormItem,
  },
  props: basicProps,
  emits: ['advanced-change', 'reset', 'submit', 'register'],
  setup(props, { attrs, emit }) {
    const formModel = reactive({});

    const propsRef = ref({});
    const schemaRef = ref(null);
    const { prefixCls } = useDesign('basic-form');
    const defaultValueRef = ref({});
    const isInitedDefaultRef = ref(false);

    const formElRef = ref(null);
    // 获取表单的基本配置
    const getProps = computed(() => {
      return { ...props, ...unref(propsRef) };
    });

    // 获取最外层的form class
    const getFormClass = computed(() => {
      return [
        prefixCls,
        {
          [`${prefixCls}--compact`]: unref(getProps).compact,
        },
      ];
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
      // 操作按钮
      if (unref(getProps).showAdvancedButton) {
        return schemas.filter((schema) => schema.component !== 'Divider');
      } else {
        return schemas;
      }
    });

     const { handleFormValues, initDefault } = useFormValues({
        getProps,
        defaultValueRef,
        getSchema,
        formModel,
      });

    // 使用表单方法
    const { validateFields } = useFormEvents({
      emit,
      getProps,
      formModel,
      getSchema,
      defaultValueRef,
      formElRef,
      schemaRef,
      handleFormValues,
    });

    function setFormModel(key, value) {
      formModel[key] = value;
      //字段校验规则
      const { validateTrigger } = unref(getBindValue);
      if (!validateTrigger || validateTrigger === 'change') {
        validateFields([key]).catch((_) => {});
      }
    }

    onMounted(() => {
      initDefault();
      // console.log(formElRef);
    });

     watch(
        () => getSchema.value,
        (schema) => {
          // nextTick(() => {
          //   //  Solve the problem of modal adaptive height calculation when the form is placed in the modal
          //   modalFn?.redoModalHeight?.();
          // });
          if (unref(isInitedDefaultRef)) {
            return;
          }
          if (schema?.length) {
            initDefault();
            isInitedDefaultRef.value = true;
          }
        },
      );


    // form 的操作
    const formActionType = {};
    return {
      getRow,
      getProps,
      getSchema,
      formModel,
      setFormModel,
      getBindValue,
      getFormClass,
      formActionType,
      formElRef,
      defaultValueRef,
    };
  },
};
</script>

<style>
</style>