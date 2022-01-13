<template>
  <div :class="prefixCls">
    <div :class="`${prefixCls}-top`">
      <div :class="`${prefixCls}-top-header`">
        <div :class="`${prefixCls}-top-header-left`" >
          <div>{{ helloTip }}</div>
          <div></div>
        </div>
        <div :class="`${prefixCls}-top-header-avatar`">
          <img :src="avatarPic" alt="" />
        </div>
      </div>
    </div>
    <!-- 系统提醒开始 -->
    <div :class="`${prefixCls}-workbench`">
      <Row :class="`${prefixCls}-workbench-top`">
        <Col span="18">
          <div>
            <span :class="`${prefixCls}-workbench-top-title`">系统提醒</span>
            <span v-show="msgCount" :class="`${prefixCls}-workbench-top-num`"
              >{{ msgCount }}条未读</span
            >
          </div>
        </Col>
        <Col span="6">
          <div :class="`${prefixCls}-workbench-top-more`" @click="handleShowMore">更多>></div>
        </Col>
      </Row>
      <!-- 提醒 -->
      <div :class="`${prefixCls}-workbench-task`">
        <Row v-for="item in msgContent" :key="item.id">
          <Col span="3">
            <div
              :class="[
                `${prefixCls}-workbench-task-title`,
                item.readFlag == 1 ? 'title1' : 'title2',
              ]"
            >
              {{ item.readFlag === '1' ? '已读' : '未读' }}
            </div>
          </Col>
          <Col span="21">
            <div :class="`${prefixCls}-workbench-task-content`" @click="handleShowDetail(item)">{{
              item.msgContent
            }}</div>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 系统提醒结束 -->
    <div :class="`${prefixCls}-content`">
      <div :class="`${prefixCls}-content-title`">信息采集</div>
      <div :class="`${prefixCls}-content-matrix`">
        <div :class="`${prefixCls}-content-cont`" v-for="i in 6">
          <div>
            <img :src="pic_nopic" alt="" />
            <div>事件上报</div>
          </div>
        </div>
      </div>
    </div>
    
  </div>

  <DTabbar />
</template>

<script>
import { ref, computed } from 'vue';
import DTabbar from '@/components/DTabbar.vue';
import { useDesign } from '@/hooks/web/useDesign';
import { Button, Row, Col } from 'vant';
import { useUserStoreWithOut } from '@/store/modules/user';
import avatar from '../../../assets/images/avatar.png';
import pic_nopic from '../../../assets/images/pic_nopic@2x.png';
import { dateUtil } from '@/utils/dateUtil';
import { getFileAccessHttpUrl } from '@/utils';
import { getUserMsg, getUserMsgCount } from '@/api/sys/user';

export default {
  components: { DTabbar, Button, Row, Col },
  setup() {
    const { prefixCls } = useDesign('home');
    const userStore = useUserStoreWithOut();
    const msgCount = ref(0);
    const msgContent = ref([]);

    // 登录人名字
    const helloTip = computed(() => {
      const time = dateUtil().format('HH');
      let text = '';
      if (time >= 18 || time < 6) {
        text = '晚上好，';
      } else if (time >= 6 && time < 12) {
        text = '上午好，';
      } else {
        text = '下午好，';
      }
      return text + userStore.getUserInfo.realname;
    });
    // 头像
    const avatarPic = computed(
      () =>
        (userStore.getUserInfo.avatar && getFileAccessHttpUrl(userStore.getUserInfo.avatar)) ||
        avatar,
    );
    // 更多
    const handleShowMore = () => {};

    // 消息详情
    const handleShowDetail = () => {};

    // 获取用户消息
    getUserMsg({ pageNo: 1, pageSize: 2, msgCategory: 2 }).then((res) => {
      msgContent.value = res.records;
    });

    // 获取未读消息
    getUserMsgCount().then((res) => {
      msgCount.value = res.anntMsgTotal + res.sysMsgTotal;
    });

    return {
      prefixCls,
      helloTip,
      avatarPic,
      msgCount,
      handleShowMore,
      handleShowDetail,
      msgContent,
      avatar,
      pic_nopic
    };
  },
};
</script>

<style lang="less" >
@prefix-cls: ~'@{namespace}-home';
.@{prefix-cls} {
  background: #fff;
  &-top {
    background: url('@/assets/images/home_bg_top.png') center center no-repeat;
    width: 100vw;
    height: 212px;
    background-size: 100% 100%;
    &-header {
      height: 186px;
      z-index: auto;
      padding: 0 24px 0 19px;
      font-size: 20px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &-left{
          flex: 1;
      }
      &-avatar {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        > img {
          height: 100%;
          width: auto;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  // 系统提醒
  &-workbench {
    width: 355px;
    height: 141px;
    margin: -56px auto 0;
    background: url('@/assets/images/home_bg_console.png') center center no-repeat;
    background-size: 100% 100%;
    padding: 0 18px 0;
    &-top {
      line-height: 41px;
      &-title {
        font-size: 16px;
        font-weight: 600;
      }
      &-more {
        color: #999;
        text-align: right;
      }
      &-num {
        color: #f00;
        padding-left: 6px;
      }
    }

    &-task {
      font-size: 12px;
      > div {
        padding: 0 0 12px 0;
      }
      &-title {
        width: 40px;
        height: 24px;
        line-height: 24px;
        border-radius: 2px;
        text-align: center;
        &.title1 {
          color: #1990ff;
          background: rgba(25, 144, 255, 0.09);
        }
        &.title2 {
          color: #ffa400;
          background: rgba(255, 164, 0, 0.09);
        }
      }
      &-content {
        display: inline-block;
        width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
        margin-left: 8px;
        line-height: 24px;
        font-size: 14px;
        color: #666666;
      }
    }
  }

  // 信息采集
  &-content {
    padding: 0 16px 20px;
    &-title {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 8px;
    }
    &-matrix {
      display: flex;
      flex-wrap: wrap;
      > div:nth-child(4n-1),
      > div:nth-child(2n + 2) {
        margin-left: 18px;
      }
    }
    &-cont {
      width: 72px;
      > div {
        padding-top: 10px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        > div {
          width: 56px;
          font-size: 12px;
          color: #666;
        }
      }
      img {
        width: 36px;
        height: 36px;
        margin-bottom: 4px;
      }
    }
  }
}
</style>