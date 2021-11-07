<script>
export default {
  name: 'BasicFormItem',
  inheritAttrs: false,
  props: {
    schema: {
      type: Object,
      default: () => ({}),
    },
    formProps: {
      type: Object,
      default: () => ({}),
    },
    allDefaultValues: {
        type: Object ,
        default: () => ({}),
      },
  },
};
</script>

<style>
</style>