import { ref, nextTick, computed } from 'vue';
import { useScript } from '@/hooks/web/useScript';

// 使用高德API
export function useGaodeApi(props, { searchVal }) {
  const mapInstance = ref(); // 地图实例
  const placeSearch = ref(); // 搜索实例
  const geocoder = ref(); //地理编码实例
  const markerInstance = ref(); // markerInstance 点位实例  用于单个点
  const { toPromise } = useScript({
    src: 'https://webapi.amap.com/maps?v=2.0&key=de4f31b386e460608cebd0caf2027330&plugin=AMap.PlaceSearch,AMap.Geocoder',
  });

  const getProps = computed(() => props);

  async function initCustomMap({ center, mapEl, address, lnglat, addressList }) {
    await toPromise();
    await nextTick();
    const AMap = window.AMap;

    // 实例化地图
    mapInstance.value = new AMap.Map(mapEl, {
      zoom: 11,
      center: center,
      viewMode: '3D',
    });

    // 创建marker点
    createMarker(center);

    // 创建搜索对象
    createSearch();

    // 创建地理编码对象
    createGeocode();

    // 地图点击事件
    mapInstance.value.on('click', (e) => {
      geocoder.value.getAddress(e.lnglat, (status, result) => {
        if (status === 'complete') {
          address.value = result.regeocode.formattedAddress;
          lnglat.longitude = e.lnglat.getLng();
          lnglat.latitude = e.lnglat.getLat();
          // 设置marker 点位位置
          markerInstance.value.setPosition(e.lnglat);
        }
      });
    });
  }

  // 创建marker
  function createMarker(lnglat) {
    markerInstance.value = new AMap.Marker({
      map: mapInstance.value,
      position: center,
    });
  }

  // 创建搜索对象
  function createSearch() {
    placeSearch.value = new AMap.PlaceSearch({
      city: getProps.value.city, //城市
      type: '', //数据类别
      pageSize: 10, //每页结果数,默认10
      pageIndex: 1, //请求页码，默认1
      extensions: 'base', //返回
    });
  }

  // 创建地理编码对象
  function createGeocode() {
    geocoder.value = new AMap.Geocoder({});
  }

  function gaodeSearch() {
    return new Promise((r) => {
      placeSearch.value.search(searchVal.value, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          console.log(result.poiList.pois);
          addressList.value = result.poiList.pois;
          // this.showAddressList = true;
          r(result);
        }
      });
    });
  }

  return {
    initCustomMap,
    gaodeSearch,
  };
}
