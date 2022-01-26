<template>
  <Field v-bind="getAttrs" is-link  @clear="handleClear" @click="!getAttrs.readonly ? (show = true) : null" v-model="state" />

  <Popup v-model:show="show" round @opened="opened" :style="{ height: '80%' }" position="bottom">
    <div class="baseMap">
      <Search v-model="searchVal" show-action placeholder="请输入搜索关键词" @search="onSearch">
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </Search>
      <div style="padding: 0 10px 8px">地址: {{ address }}</div>
      <div ref="wrapRef" style="flex: 1"></div>
    </div>
    <BtnWrap text="保存地址" @click="handleSave" :placeholder="false" />
  </Popup>
</template>

<script>
import { ref, unref, reactive, computed } from 'vue';
import { Field, Popup, Search } from 'vant';
import { useRuleFormItem } from '@/hooks/component/useFormItem';
import { get } from 'lodash-es';
import { useMessage } from '@/hooks/web/useMessage';
// 高德
// import { useGaodeApi } from './hooks/useGaode';
// 天地图
import { useTianApi } from './hooks/useTian';

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
    // 地址搜索后的结果
    const addressList = ref([]);
    // 点位
    const lnglat = reactive({
      longitude: '',
      latitude: '',
    });

    const { createMessage } = useMessage();

    // const { initGaodeMap, gaodeSearch } = useGaodeApi(props, { searchVal });

    const { initTianMap } = useTianApi(props, { searchVal });

    // 获取 field 的属性
    const getAttrs = computed(() => {
      return {
        ...get(attrs, 'inputProps'),
        label: null,
      };
    });

    console.log(attrs)


    async function initMap() {
      const { formValues: { model } = {} } = attrs;
      const { lngField, latField } = props;
      const mapEl = unref(wrapRef);
      if (!mapEl) return;
      const center =
        (model[lngField] && model[latField] && [model[lngField], model[latField]]) ||
        props.position;
      // 高德地图初始化
      // initGaodeMap({ center, mapEl, address, lnglat, addressList });
      initTianMap({ center, mapEl, address, lnglat, addressList });
    }

    const getText = computed(() => {
      return ''
    })

    const opened = () => {
      address.value = state.value;
      initMap();
    };

    const onSearch = async () => {
      // await gaodeSearch();
    };

    // 保存
    const handleSave = () => {
      if (!address.value) {
        return createMessage('请选择地址!');
      }
      show.value = false;
      emit('change', address.value, {
        [props.lngField]: lnglat.longitude,
        [props.latField]: lnglat.latitude,
        flag: 'map',
      });
    };

    // 清除
    const handleClear = () => {
        emit('change', '', {
        [props.lngField]: '',
        [props.latField]: '',
        flag: 'map',
      });
    }

    return {
      getAttrs,
      show,
      wrapRef,
      onSearch,
      address,
      searchVal,
      opened,
      state,
      getText,
      handleSave,
      handleClear
    };
  },
};
</script>

<style scoped lang="less">
.baseMap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
