<script lang="jsx" >
import { computed, ref } from 'vue';
import { Icon, Dialog } from 'vant';
import { isString, isArray } from '@/utils/is';
import { getSlot } from '@/utils/helper/jsxHelper';
import { useDesign } from '@/hooks/web/useDesign';
import { useMessage } from '@/hooks/web/useMessage';
const props = {
  /**
   * Help text max-width
   * @default: 600px
   */
  maxWidth: { type: String, default: '600px' },
  /**
   * Whether to display the serial number
   * @default: false
   */
  showIndex: { type: Boolean },
  /**
   * Help text font color
   * @default: #ffffff
   */
  color: { type: String, default: '#ffffff' },
  /**
   * Help text font size
   * @default: 14px
   */
  fontSize: { type: String, default: '14px' },
  /**
   * Help text list
   */
  placement: { type: String, default: 'right' },
  /**
   * Help text list
   */
  text: { type: [Array, String],default: '' },
  title: { type: String, default: '提示' },
};

export default {
  name: 'BasicHelp',
  inheritAttrs:false,
  props,
  setup(props, { slots }) {
    const { prefixCls } = useDesign('basic-help');
    const { createAlertDialog } = useMessage();
    const show = ref(false);
    const handleShow = () => {
      show.value = !show.value;
    };
    const getTooltipStyle = computed(() => ({ color: props.color, fontSize: props.fontSize }));

    const getOverlayStyle = computed(() => ({ maxWidth: props.maxWidth }));

    function renderContent() {
      const textList = props.text;

      if (isString(textList)) {
        return <p>{textList}</p>;
      }

      if (isArray(textList)) {
        return textList.map((text, index) => {
          return (
            <p key={text}>
              <>
                {props.showIndex ? `${index + 1}. ` : ''}
                {text}
              </>
            </p>
          );
        });
      }
      return null;
    }

    function onClose(e) {
      console.log(e)
    }

    function  onCancel(e) {
      console.log(e)
      
    }
    return () => {
    
      return (
          <>
            <span onClick={handleShow} >
                {getSlot(slots) || <Icon name="info-o" />}
              </span>

         <Dialog.Component 
              class={prefixCls} 
              v-model={[show.value, 'show']} 
              onClose={onClose} 
              onCancel={onCancel}
               >
            {{
              title: () => <span class={`${prefixCls}-title`} >{props.title}</span>,
              default: () => <div class={`${prefixCls}-content`} >{renderContent()}</div>,
            }}
          </Dialog.Component>
          </>
      );
    };
  },
};
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-basic-help';

.@{prefix-cls} {
  &-title {
    font-size: 18px;
    font-weight: 600;
  }
  &-content {
    padding: 16px 16px 24px;
  }
}
</style>
