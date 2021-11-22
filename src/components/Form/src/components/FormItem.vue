<script lang="jsx" >
  import {  computed, unref, toRefs } from 'vue';
  import { Field, Col, Divider,Button, Icon } from 'vant';
  import { componentMap } from '../componentMap';
  import { BasicHelp } from '@/components/Basic';
  import { isBoolean, isFunction, isNull, isObject } from '@/utils/is';
  import { getSlot } from '@/utils/helper/jsxHelper';
  import { createPlaceholderMessage, setComponentRuleType } from '../helper';
  import { upperFirst, cloneDeep } from 'lodash-es';
  import { useItemLabelWidth } from '../hooks/useLabelWidth';

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

      const itemLabelWidthProp = useItemLabelWidth(schema, formProps);

      const getValues = computed(() => {
        const { allDefaultValues, formModel, schema } = props;
        console.log(formModel)

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
        const {
          rules: defRules = [],
          component,
          rulesMessageJoinLabel,
          label,
          dynamicRules,
          required,
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

        function validator(rule, value) {
          const msg = rule.message || defaultMsg;
          if (value === undefined || isNull(value)) {
            // 空值
            return Promise.reject(msg);
          } else if (Array.isArray(value) && value.length === 0) {
            // 数组类型
            return Promise.reject(msg);
          } else if (typeof value === 'string' && value.trim() === '') {
            // 空字符串
            return Promise.reject(msg);
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
            return Promise.reject(msg);
          }
          return Promise.resolve();
        }

        const getRequired = isFunction(required) ? required(unref(getValues)) : required;

        if ((!rules || rules.length === 0) && getRequired) {
          rules = [{ required: getRequired, validator }];
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

        // Maximum input length rule check
        const characterInx = rules.findIndex((val) => val.max);
        if (characterInx !== -1 && !rules[characterInx].validator) {
          rules[characterInx].message =
            rules[characterInx].message ||
            `字符数应小于${rules[characterInx].max}位`;
        }
        return rules;
      }

      function renderComponent() {
        const {
          renderComponentContent,
          component,
          field,
          changeEvent = 'change',
          valueField,
        } = props.schema;

        const isSelect = component && ['ApiSelect'].includes(component);

        const eventKey = `on${upperFirst(changeEvent)}`;

        const on = {
          [eventKey]: (...args) => {
            const [e] = args;
            if (propsData[eventKey]) {
              propsData[eventKey](...args);
            }
            const value =  isSelect ?isObject(e) ? e.value : e: e;
            props.setFormModel(field, value);
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
          propsData.placeholder =
            unref(getComponentsProps)?.placeholder || createPlaceholderMessage(component);
        }
        propsData.codeField = field;
        propsData.formValues = unref(getValues);

        const bindValue = {
          [valueField || 'modelValue']: props.formModel[field],
        };
        const compAttr = {
          ...propsData,
          ...on,
          ...bindValue,
        };
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
        const { itemProps, slot, render, field, suffix, component } = props.schema;
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
            <Field
              name={field}
              colon={colon}
              class={{ 'suffix-item': showSuffix }}
              {...(itemProps)}
              rules={handleRules()}
              labelCol={labelCol}
              wrapperCol={wrapperCol}
            >
            {{
              label: () => renderLabelHelpMessage(),
              input: () =>  <div style="display:flex">
                <div style="flex:1;">{getContent()}</div>
              </div>,
              // button: () => <Button size="small" type="primary">发送验证码</Button>,
              // "right-icon": () => <Icon name="arrow" />,
              // "left-icon": () => <Icon name="arrow" />,
              // 'error-message': () => '错误',
              // extra: () => "???"
            }}
              
            </Field>
          );
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
