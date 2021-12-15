<template>
  <Field readonly @click="show = true" v-model="state" />

  <Popup v-model:show="show" round @opened="opened" :style="{ height: '80%' }" position="bottom">
    <div class="gaodeMap">
      <Search v-model="searchVal" show-action placeholder="请输入搜索关键词" @search="onSearch">
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </Search>
      <div style="padding: 0 10px 8px">地址: {{ address }}</div>
      <div ref="wrapRef" style="flex: 1"></div>
    </div>
  </Popup>
</template>

<script>
import { ref, unref, nextTick, reactive, computed } from 'vue';
import { Field, Popup, Search } from 'vant';
import { useScript } from '@/hooks/web/useScript';
import { useRuleFormItem } from '@/hooks/component/useFormItem';

const MAP_URL =
  'https://webapi.amap.com/maps?v=2.0&key=de4f31b386e460608cebd0caf2027330&plugin=AMap.PlaceSearch,AMap.Geocoder';

export default {
  name: 'gaodeMap',
  inheritAttrs: false,
  components: { Field, Popup, Search },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    position: {
      type: Array,
      default: () => [122.304605, 30.251667],
    },
    lngField: {
      type: String,
      default: 'longitude',
    },
    latField: {
      type: String,
      default: 'latitude',
    },
    city: {
      type: String,
      default: '浙江',
    },
  },
  emits: ['change'],
  setup(props, { emit, attrs }) {
    const show = ref(false);
    const wrapRef = ref(null);
    const searchVal = ref('');
    const [state] = useRuleFormItem(props);
    const address = ref('');
    // 地图
    const map = ref(null);
    // 地址搜索
    const placeSearch = ref(null);
    // 地理编码
    const geocoder = ref(null);
    // marker 点实例
    const marker = ref(null);
    const { toPromise } = useScript({ src: MAP_URL });
    async function initMap() {
      const { formValues:{model} } = attrs;
      const { lngField, latField } = props;
      await toPromise();
      await nextTick();
      const wrapEl = unref(wrapRef);
      if (!wrapEl) return;
      const AMap = window.AMap;
      const center = model[lngField] && model[latField] && [model[lngField] , model[latField]] ||  props.position;
      map.value = new AMap.Map(wrapEl, {
        zoom: 11,
        center: center,
        viewMode: '3D',
      });
      placeSearch.value = new AMap.PlaceSearch({
        city: props.city, //城市
        type: '', //数据类别
        pageSize: 10, //每页结果数,默认10
        pageIndex: 1, //请求页码，默认1
        extensions: 'base', //返回
      });
      geocoder.value = new AMap.Geocoder({});
      marker.value = new AMap.Marker({
        map: map.value,
        position: center,
      });

      // 点击地图
      map.value.on('click', (e) => {
        geocoder.value.getAddress(e.lnglat, (status, result) => {
          if (status === 'complete') {
            address.value = result.regeocode.formattedAddress;
            marker.value.setPosition(e.lnglat);
            emit('change', address.value, {
              [props.lngField]: e.lnglat.getLng(),
              [props.latField]: e.lnglat.getLat(),
              flag: 'map',
            });
          }
        });
      });
    }
    const opened = () => {
      address.value = state.value;
      initMap();
    };

    const onSearch = () => {
      placeSearch.value.search(searchVal.value, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result.poiList.pois)
          // this.addressList = result.poiList.pois;
          // this.showAddressList = true;
        }
      });
    };

    return {
      show,
      wrapRef,
      onSearch,
      address,
      searchVal,
      opened,
      state,
    };
  },
};
</script>

<style scoped lang="less">
.gaodeMap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
