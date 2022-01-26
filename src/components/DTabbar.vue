
<script lang="jsx" >
import { computed, ref, onMounted } from 'vue';
import { Tabbar, TabbarItem, Icon } from 'vant';
import { usePermissionStoreWithOut } from '@/store/modules/permission';
export default {
  name:'DTabbar',
  setup() {
    const active = ref('');
    const permissionStore = usePermissionStoreWithOut();
    const list = computed(() => permissionStore.getTabbarList);
    const getImgUrl = (img) => `/src/assets/commonImg/${img}`;

    onMounted(() => {
      let id = localStorage.getItem('currentId') || list.value[0]?.id;
      // 默认选中
      active.value = id;
      permissionStore.setCurrentId(id)
    })
    return () => {
      return (
         <Tabbar v-model={active.value} onChange={permissionStore.setCurrentId} route border placeholder safe-area-inset-bottom>
        {
          list.value.map(item => {
            return <TabbarItem  to={`/sys${item.path}`} name={item.id} >
            {{
              default: () =>  <span>{item.title}</span>,
              icon: () => {
                let flag = item.icon?.split('.');
                return flag && flag.length == 1 ? <Icon name={item.icon} /> : <img src={getImgUrl(item.icon)} />;
              }
            }}
            </TabbarItem>
          })
        }
        </Tabbar>
   
      )
    }
  },
};
</script>

<style>
</style>