<template>
  <div>
    <Field
      v-model="departName"
      :rules="rules"
      @click="treeShow = true"
      :placeholder="placeholder"
      readonly
    />

    <Popup
      class="select-depart"
      v-model:show="treeShow"
      :style="{ height: '50%' }"
      position="bottom"
    >
      <div class="select-depart-title">
        <span @click="handelClick('close')">关闭</span>
        <span style="color: rgb(41, 121, 255)" @click="handelClick('ok')">确定</span>
      </div>
      <LyTree
        :ready="ready"
        node-key="key"
        @node-expand="handleNodeExpand"
        lazy
        :highlightCurrent="true"
        v-if="isReady"
        :props="props"
        :load="loadNode"
        @node-click="handleNodeClick"
      />
    </Popup>
  </div>
</template>

<script>
import LyTree from '@/components/ly-tree/ly-tree.vue';
import { queryDepartTreeList } from '@/api/sys/api';
import { Toast, Field, Popup } from 'vant';
import { defHttp } from '@/utils/http/axios';
export default {
  components: { LyTree, Field, Popup },
  props: {
    rules: {
      type: Array,
      default: () => {
        return [{ required: true, message: '请选择部门' }];
      },
    },
    placeholder: {
      type: String,
      default: '请选择部门',
    },
    valueField: {
      type: String,
      defailt: 'id',
    },
  },
  data() {
    return {
      treeShow: false,
      //树形结构数据
      ready: false, // 这里用于自主控制loading加载状态，避免异步正在加载数据的空档显示“暂无数据”
      treeData: [],
      props: {
        label: 'departName',
        children: 'children',
        isLeaf: 'leaf',
      },
      form: {
        departName: '',
      },
      departName: '',
      currentNodeKey: '',
      childNodesId: [],
      isReady: false,
    };
  },
  created() {
    queryDepartTreeList().then((res) => {
      this.treeData = [...res];
      console.log(this.treeData);
      this.ready = true;
    });
    this.isReady = true;
  },
  methods: {
    handleNodeExpand(obj) {
      // console.log('handleNodeExpand', JSON.stringify(obj));
    },
    loadNode(node, resolve) {
      defHttp
        .get({
          url: '/sys/category/loadTreeData',
          params: {
            pid: '',
            pcode: '0',
            condition: '',
          },
        })
        .then((res) => {
          resolve(res);
          console.log(res);
        });
    },
    // uni-app中emit触发的方法只能接受一个参数，所以会回传一个对象，打印对象即可见到其中的内容
    handleNodeClick(obj) {
      console.log(obj);
      this.childNodesId = obj.childNodesId;
      let { data } = obj;
      this.form.departName = data.departName;
      this.form.orgCode = data[this.valueField || 'id'];
    },
    handelClick(type) {
      switch (type) {
        case 'ok':
          if (this.childNodesId.length) {
            return Toast.fail('只能选择最后一级');
          }
          this.departName = this.form.departName;
          this.treeShow = false;
          this.$emit('input', this.form.orgCode);
          this.$emit('ok', this.form);
          break;
        case 'close':
          this.treeShow = false;
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style scoped lang="less">
.select-depart {
  &-title {
    display: flex;
    justify-content: space-between;
    padding: 15px 20px;
    height: 50px;
    background: #fff;
    z-index: 8888;
  }
}
</style>