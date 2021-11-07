<script lang="jsx" >
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
  setup(){

    return () => {
      
      return (<div>111</div>)
    }
  }
};
</script>

<style>
</style>