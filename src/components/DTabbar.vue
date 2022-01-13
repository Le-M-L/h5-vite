<template>
  <Tabbar v-model="active" @change="onChange" route border placeholder safe-area-inset-bottom>
    <TabbarItem v-for="(item, i) in list" :to="item.to" :name="item.name" :key="i" :icon="item.icon" >
      <span>{{ item.label }}</span>
    </TabbarItem>
  </Tabbar>
</template>

<script>
import { ref } from 'vue';
import { Tabbar, TabbarItem } from 'vant';
export default {
  components: {
    Tabbar,
    TabbarItem,
  }, 
  setup() {
    const active = ref('home');
    const list = ref([
      {
        label: '个人中心',
        icon: 'home-o',
        name:'home',
        dot: '', // 红点
        badge: '', // 数量
        to:'/sys/home',// 点击跳转的路由链接

      },
      {
        label: '我的',
        icon: 'setting-o',
        name:'setting',
        to:'/sys/setting'
      },
    ]);

    const onChange = () => {

    }

    return {
      list,
      active,
      onChange
    };
  },
};
</script>

<style>
</style>