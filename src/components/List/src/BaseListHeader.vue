<template>
  <div class="base-list-header">
    <div class="base-list-header-content">
      <div>
        <DatePicker @change="handleChange" v-model="time" />
      </div>
      <div>
        <Select @change="handleChange" v-model="time" />
      </div>
    </div>
    <div class="base-list-header-line"></div>
  </div>
  <div class="base-list-header-placeholder"></div>
</template>

<script>
import { ref } from 'vue';
import { DatePicker } from '@/components/DatePicker';
import { Select } from '@/components/Select';
export default {
  components: {
    DatePicker,
    Select,
  },
  setup() {
    const time = ref('2020-11-12');
    const handleChange = (val) => {
      console.log(val);
      // time.value = val;
    };
    return {
      time,
      handleChange,
    };
  },
};
</script>

<style lang="less" >
@listHeader: 56px;
.base-list-header {
  position: fixed;
  width: 100%;
  top: 46px;
  height: @listHeader;
  z-index: 1111;
  &-content {
    display: flex;
    background: #fff;
    > div {
      flex: 1;
    }
  }
  &-line {
    height: 12px;
    background: #f4f7f9;
  }
}
.base-list-header-placeholder {
  height: @listHeader;
}
</style>