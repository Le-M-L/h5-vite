import { ref, nextTick, computed } from 'vue';
import { useScript } from '@/hooks/web/useScript';

// 使用高德API
export function useTianApi(props, { searchVal }) {
  const mapInstance = ref(); // 地图实例
  const placeSearch = ref(); // 搜索实例
  const geocoder = ref(); //地理编码实例
  const markerInstance = ref(); // markerInstance 点位实例  用于单个点
  const { toPromise } = useScript({
    src: 'http://api.tianditu.gov.cn/api?v=4.0&tk=b1df9d63988426fda85b3a3ac00f5c9c',
  });

  const getProps = computed(() => props);

  async function initTianMap({ center, mapEl, address, lnglat, addressList }) {
    await toPromise();
    await nextTick();

    mapInstance.value = new T.Map(mapEl);

    // 创建marker点
    createMarker(new T.LngLat(center[0], center[1]));
    // 创建搜索对象
    // createSearch();
    // 创建地理编码对象
    createGeocode();

    // 设置中心点
    mapInstance.value.centerAndZoom(new T.LngLat(center[0], center[1]), 13);
    //允许鼠标双击放大地图
    mapInstance.value.enableScrollWheelZoom();

    // 地图点击事件
    mapInstance.value.addEventListener('click', (e) => {
      createMarker(e.lnglat);
      geocoder.value.getLocation(e.lnglat, (res) => {
        address.value = res.resultObj.formatted_address;
        lnglat.longitude = res.resultObj.location.lon;
        lnglat.latitude = res.resultObj.location.lat;
      });
    });
  }

  // 创建marker
  function createMarker(lnglat) {
    markerInstance.value = new T.Marker(lnglat);
    mapInstance.value.clearOverLays();
    mapInstance.value.addOverLay(markerInstance.value);
  }

  // 创建搜索对象
  function createSearch() {
    // getProps.value.city
    placeSearch.value = new T.LocalSearch(mapInstance.value, {
      pageCapacity: 10, //每页显示的数量
      onSearchComplete: (result) => {
        //根据返回类型解析搜索结果
        switch (parseInt(result.getResultType())) {
          case 1:
            //解析点数据结果
            addressList.value = result.getPois()
            break;
          case 2:
            //解析推荐城市
            // this.showAddressList = false;
            break;
          case 3:
            //解析行政区划边界
            // this.area(result.getArea());
            break;
        }
      }, //接收数据的回调函数
    });
  }

  // 创建地理编码对象
  function createGeocode() {
    geocoder.value = new T.Geocoder();
  }

  function gaodeSearch() {
    return new Promise((r) => {
      placeSearch.value.search(searchVal.value);
    });
  }

  return {
    initTianMap,
    gaodeSearch,
  };
}
