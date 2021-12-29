<template>
  <div class="base-list-header">
    <div class="base-list-header-content">
      <div class="base-list-header-content-item">
        <DCalendar @register="register" type="range" v-model="time">
          <template #text="{ data }">
            <div class="base-list-header-content-item-data" @click="handleShow">
              {{ data }}
              <Icon name="play" />
            </div>
          </template>
        </DCalendar>
      </div>

      <div class="base-list-header-content-item">
        <DSelect @register="register1" v-model="school">
          <template #text="{ data }">
            <div class="base-list-header-content-item-data" @click="handleShow1">
              {{ data }}
              <Icon name="play" />
            </div>
          </template>
        </DSelect>
      </div>
    </div>
    <div class="base-list-header-line"></div>
  </div>
  <div class="base-list-header-placeholder"></div>
</template>

<script>
import { ref, unref } from 'vue';
import { Icon } from 'vant';
import { DCalendar, useCalendar } from '@/components/DCalendar';
import { DSelect, useSelect } from '@/components/DSelect';

export default {
  components: {
    DCalendar,
    DSelect,
    Icon,
  },
  setup() {
    const time = ref([]);
    const school = ref('');
    const [register, { handleShow }] = useCalendar({
      callback: (val) => {
        console.log(val);
      },
    });
    const [register1, { handleShow: handleShow1 }] = useSelect({
      options: [
        { value: '1', text: '小学', title: '小学' },
        { value: '2', text: '初中', title: '初中' },
        { value: '3', text: '高中', title: '高中' },
        { value: '4', text: '大专', title: '大专' },
        { value: '5', text: '本科', title: '本科' },
        { value: '6', text: '研究生', title: '研究生' },
        { value: '7', text: '硕士', title: '硕士' },
        { value: '8', text: '博士', title: '博士' },
        { value: '9', text: '其他', title: '其他' },
      ],
      callback: (val) => {
        console.log(val);
      },
    });

    return {
      time,
      school,
      register,
      handleShow,
      register1,
      handleShow1,
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
    padding: 0 20px;
    &-item {
      height: 44px;
      text-align: left;

      &-data {
        height: 100%;
        display: flex;
        align-items: center;
        font-size: 14px;
        > i {
          transform: rotate(90deg);
          color: #999;
          margin-left: 5px;
        }
      }
      &:nth-child(1) {
        flex: 2;
      }
      &:nth-child(2) {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
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