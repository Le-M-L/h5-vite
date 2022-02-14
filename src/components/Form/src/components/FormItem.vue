<script lang="jsx" >
  import {  computed, unref, ref, toRefs } from 'vue';
  import { Field, Col, Divider,Button, Icon } from 'vant';
  import { componentMap } from '../componentMap';
  import { BasicHelp } from '@/components/Basic';
  import { isBoolean, isFunction, isNull, isObject } from '@/utils/is';
  import { getSlot } from '@/utils/helper/jsxHelper';
  import { createPlaceholderMessage, setComponentRuleType, validatorMax, validatorMin } from '../helper';
  import { upperFirst, cloneDeep } from 'lodash-es';
  import { useItemLabelWidth } from '../hooks/useLabelWidth';
  import { useDesign } from '@/hooks/web/useDesign';

  export default {
    name: 'BasicFormItem',
    inheritAttrs: false,
    props: {
      schema: {
        type: Object,
        default: () => ({}),
      },
      formProps: {
        type: Object ,
        default: () => ({}),
      },
      allDefaultValues: {
        type: Object ,
        default: () => ({}),
      },
      formModel: {
        type: Object,
        default: () => ({}),
      },
      setFormModel: {
        type: Function,
        default: null,
      },
      tableAction: {
        type: Object ,
      },
      formActionType: {
        type: Object,
      },
    },
    setup(props, { slots }) {

      const { schema, formProps } = toRefs(props) ;
      const { prefixCls } = useDesign('basic-form');
      const errorMsg = ref('')
      const itemLabelWidthProp = useItemLabelWidth(schema, formProps);
      const getValues = computed(() => {
        const { allDefaultValues, formModel, schema } = props;
        // console.log(formModel)
        const { mergeDynamicData } = props.formProps;
        return {
          field: schema.field,
          model: formModel,
          values: {
            ...mergeDynamicData,
            ...allDefaultValues,
            ...formModel,
          } ,
          schema: schema,
        };
      });

      const getComponentsProps = computed(() => {
        const { schema, tableAction, formModel, formActionType } = props;
        let { componentProps = {} } = schema;
        if (isFunction(componentProps)) {
          componentProps = componentProps({ schema, tableAction, formModel, formActionType }) ?? {};
        }
        if (schema.component === 'Divider') {
          componentProps = Object.assign({ type: 'horizontal' }, componentProps, {
            orientation: 'left',
            plain: true,
          });
        }
        return componentProps ;
      });

      const getIsError = computed(() => {
        const { schema } = props;
          return schema.isError 
      })

      const getDisable = computed(() => {
        const { disabled: globDisabled } = props.formProps;
        const { dynamicDisabled } = props.schema;
        const { disabled: itemDisabled = false } = unref(getComponentsProps);
        let disabled = !!globDisabled || itemDisabled;
        if (isBoolean(dynamicDisabled)) {
          disabled = dynamicDisabled;
        }
        if (isFunction(dynamicDisabled)) {
          disabled = dynamicDisabled(unref(getValues));
        }
        return disabled;
      });

      function getShow() {
        const { show, ifShow } = props.schema;
        const { showAdvancedButton } = props.formProps;
        const itemIsAdvanced = showAdvancedButton
          ? isBoolean(props.schema.isAdvanced)
            ? props.schema.isAdvanced
            : true
          : true;

        let isShow = true;
        let isIfShow = true;

        if (isBoolean(show)) {
          isShow = show;
        }
        if (isBoolean(ifShow)) {
          isIfShow = ifShow;
        }
        if (isFunction(show)) {
          isShow = show(unref(getValues));
        }
        if (isFunction(ifShow)) {
          isIfShow = ifShow(unref(getValues));
        }
        isShow = isShow && itemIsAdvanced;
        return { isShow, isIfShow };
      }

      function handleRules() {
        const { formActionType } = props;
        const {
          rules: defRules = [],
          component,
          rulesMessageJoinLabel,
          label,
          dynamicRules,
          required,
          pattern,
          maxLength,
          minLength,
          errorInfo,
          field
        } = props.schema;
        if (isFunction(dynamicRules)) {
          return dynamicRules(unref(getValues)) ;
        }
        let rules = cloneDeep(defRules);
        const { rulesMessageJoinLabel: globalRulesMessageJoinLabel } = props.formProps;
        const joinLabel = Reflect.has(props.schema, 'rulesMessageJoinLabel')
          ? rulesMessageJoinLabel
          : globalRulesMessageJoinLabel;
        const defaultMsg = createPlaceholderMessage(component) + `${joinLabel ? label : ''}`;
        function validator(value,rule) {
          const msg = rule.message || defaultMsg;
          errorMsg.value = msg;
          // console.log(666)
          if (value === undefined || isNull(value)) {
            // 空值
            formActionType.updateSchema({field,isError:true})
            return Promise.resolve(msg);
          } else if (Array.isArray(value) && value.length === 0) {
            // 数组类型
            formActionType.updateSchema({field,isError:true})
            return Promise.resolve(msg);
          } else if (typeof value === 'string' && value.trim() === '') {
            // 空字符串
            formActionType.updateSchema({field,isError:true})
            return Promise.resolve(msg);
          } else if (
            typeof value === 'object' &&
            Reflect.has(value, 'checked') &&
            Reflect.has(value, 'halfChecked') &&
            Array.isArray(value.checked) &&
            Array.isArray(value.halfChecked) &&
            value.checked.length === 0 &&
            value.halfChecked.length === 0
          ) {
            // 非关联选择的tree组件
            formActionType.updateSchema({field,isError:true})
            return Promise.resolve(msg);
          }
          else if(pattern){
             const reg = pattern && eval(`/${pattern}/`)
             if(!reg.test(value)){
              formActionType.updateSchema({field,isError:true})
              return Promise.resolve(msg);
             }
          }

          formActionType.updateSchema({field,isError:false})
          return Promise.resolve();
        }

        const getRequired = isFunction(required) ? required(unref(getValues)) : required;

        if ((!rules || rules.length === 0) && getRequired) {
          // const trigger = 
          rules = [{ required: getRequired, validator, trigger: 'onChange', message:errorInfo }];
          if(maxLength){
            rules.push({required: getRequired, validator:validatorMax, trigger:'onBlur'})
          }

          if(minLength){
            rules.push({required: getRequired, validator:validatorMin, trigger:'onBlur'})
          }
        }

        const requiredRuleIndex = rules.findIndex(
          (rule) => Reflect.has(rule, 'required') && !Reflect.has(rule, 'validator'),
        );

        if (requiredRuleIndex !== -1) {
          const rule = rules[requiredRuleIndex];
          const { isShow } = getShow();
          if (!isShow) {
            rule.required = false;
          }
          if (component) {
            if (!Reflect.has(rule, 'type')) {
              rule.type = component === 'InputNumber' ? 'number' : 'string';
            }

            rule.message = rule.message || defaultMsg;

            if (component.includes('Input') || component.includes('Textarea')) {
              rule.whitespace = true;
            }
            const valueFormat = unref(getComponentsProps)?.valueFormat;
            setComponentRuleType(rule, component, valueFormat);
          }
        }
        // 最大输入长度规则检查
        const characterInx = rules.findIndex((val) => val.max);
        if (characterInx !== -1 && !rules[characterInx].validator) {
          rules[characterInx].message =
            rules[characterInx].message ||
            `字符数应小于${rules[characterInx].max}位`;
        }
        return rules.map(item => {
          delete item.required;
          return item
        })
      }
      function renderComponent() {
        const {
          renderComponentContent,
          component,
          field,
          changeEvent = 'change',
          valueField,
          label,
          itemProps
        } = props.schema;
        const { colon } = props.formProps;
        const isSelect = component && ['ApiSelect'].includes(component);
        const { labelCol, wrapperCol } = unref(itemLabelWidthProp);

        const inputProps = {
            name:field,
            colon:colon,
            // label:renderLabelHelpMessage(),
            rules:handleRules(),
            labelCol:labelCol,
            wrapperCol:wrapperCol,
            clearable:true,
            'clear-trigger':'always',
            ...itemProps,
        }

        const eventKey = `on${upperFirst(changeEvent)}`;

        const on = {
          [eventKey]: (...args) => {
            const [e] = args;
            if (propsData[eventKey]) {
              propsData[eventKey](...args);
            }
            const target = e ? e.target : null;

            const value =  target? target.value : (isSelect && isObject(e) ? e.value : e);
            props.setFormModel(field, value);
            // 对地图经纬度特殊处理
            if(args[1] && args[1].flag === 'map'){
              Object.keys(args[1]).map(item => {
                if(item !== 'flag'){
                  props.setFormModel(item, args[1][item]);
                }
              })
            }
          },
        };
        const Comp = componentMap.get(component) ;
        const { autoSetPlaceHolder, size } = props.formProps;
        const propsData = {
          allowClear: true,
          getPopupContainer: (trigger) => trigger.parentNode,
          size,
          ...unref(getComponentsProps),
          disabled: unref(getDisable),
        };

        const isCreatePlaceholder = !propsData.disabled && autoSetPlaceHolder;
        // RangePicker place is an array
        if (isCreatePlaceholder && component !== 'RangePicker' && component) {
          inputProps.placeholder =
            unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component, label);
        }
        propsData.codeField = field;
        propsData.formValues = unref(getValues);
        // 地图将model 单独使用
        if(component === 'CustomMap'){
          propsData.formData = unref(getValues).model
        }

        const bindValue = {
          [valueField || 'modelValue']: props.formModel[field],
        };
        const compAttr = {
          clearable:true,
          'clear-trigger':'always',
          ...propsData,
          ...on,
          ...bindValue,
          inputProps:inputProps,
        };
        // component == 'Input' && Object.assign(compAttr,inputProps)
        if (!renderComponentContent) {
          return <Comp {...compAttr} />;
        }
        const compSlot = isFunction(renderComponentContent)
          ? { ...renderComponentContent(unref(getValues)) }
          : {
              default: () => renderComponentContent,
            };
        return <Comp {...compAttr}>{compSlot}</Comp>;
      }

      function renderLabelHelpMessage() {
        const { label, helpMessage, helpComponentProps, subLabel } = props.schema;
        const renderLabel = subLabel ? (
          <span>
            {label} <span class="text-secondary">{subLabel}</span>
          </span>
        ) : (
          label
        );
        const getHelpMessage = isFunction(helpMessage)
          ? helpMessage(unref(getValues))
          : helpMessage;

        if (!getHelpMessage || (Array.isArray(getHelpMessage) && getHelpMessage.length === 0)) {
          return renderLabel;
        }

        return (
          <span>
            {renderLabel}
            {
              <BasicHelp placement="top" class="mx-1" text={getHelpMessage} {...helpComponentProps} />
            }
          </span>
        );
      }

      function renderItem() {
        const { itemProps:{readonly} = {}, slot, render, required, field, suffix, component, label } = props.schema;
        const { labelCol, wrapperCol } = unref(itemLabelWidthProp);
        const { colon } = props.formProps;
        if (component === 'Divider') {
          return (
            <Col span={24}>
              <Divider {...unref(getComponentsProps)}>{renderLabelHelpMessage()}</Divider>
            </Col>
          );
        } else {
          const getContent = () => {
            return slot
              ? getSlot(slots, slot, unref(getValues))
              : render
              ? render(unref(getValues))
              : renderComponent();
          };

          const showSuffix = !!suffix;
          const getSuffix = isFunction(suffix) ? suffix(unref(getValues)) : suffix;
          
          return (
            <div className={`${prefixCls}-item`}   >
              <div className={`${prefixCls}-item-label ${unref(getIsError) && 'label-error'} ${readonly && 'label-readonly'}` } >{label}{ required ?<span>*</span>:''} </div>
              {getContent()}
              {
                unref(getIsError) ? <div className={`${prefixCls}-item-error`} >{unref(errorMsg)}</div> : ''
              }
            </div>
          )
          // return component == 'Input' ?  getContent(): (
          //   <Field
          //     name={field}
          //     colon={colon}
          //     class={{ 'suffix-item': showSuffix }}
          //     {...(itemProps)}
          //     rules={handleRules()}
          //     labelCol={labelCol}
          //     wrapperCol={wrapperCol}
          //   >
          //   {{
          //     label: () => renderLabelHelpMessage(),
          //     input: () => getContent(),
          //     // button: () => <Button size="small" type="primary">发送验证码</Button>,
          //     // "right-icon": () => <Icon name="arrow" />,
          //     // "left-icon": () => <Icon name="arrow" />,
          //     // 'error-message': () => '错误',
          //     // extra: () => "???"
          //   }}
              
          //   </Field>
          // );
        }
      }

      return () => {
        const { colProps = {}, colSlot, renderColContent, component } = props.schema;
        if (!componentMap.has(component)) {
          return null;
        }

        const { baseColProps = {} } = props.formProps;
        const realColProps = { ...baseColProps, ...colProps };
        const { isIfShow, isShow } = getShow();
        const values = unref(getValues);

        const getContent = () => {
          return colSlot
            ? getSlot(slots, colSlot, values)
            : renderColContent
            ? renderColContent(values)
            : renderItem();
        };

        return (
          isIfShow && (
            <Col {...realColProps} v-show={isShow}>
              {getContent()}
            </Col>
          )
        );
      };
    },
  };
</script>
