<template>
  <el-dialog
    custom-class="dia-review"
    :visible.sync="isShow"
    :fullscreen="ish5"
    :before-close="handleClose"
  >
    <span slot="title">{{ title }}</span>
    <div class="review">
      <img class="review-page" :src="dataList[index - 1]" alt="" />
      <img
        class="svg svg-left"
        src="./icons/left.svg"
        @click="toPre"
        v-show="index > 1"
      />
      <img
        class="svg svg-right"
        src="./icons/right.svg"
        @click="toNext"
        v-show="index < dataList.length"
      />
      <span class="page-index">{{ index }}/{{ dataList.length || 0 }}</span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "review",
  components: {},
  props: {
    // 弹框是否可见
    visible: {
      type: Boolean,
      default: false
    },
    // 当前设备是否为h5
    ish5: {
      type: Boolean,
      default: false
    },
    // 弹框标题
    title: {
      type: String,
      default: "My Album"
    },
    dataList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      index: 1,
      isShow: false
    };
  },
  watch: {
    visible: {
      handler(val) {
        console.log("val :>> ", val);
        this.isShow = val;
      },
      // immediate: true
    }
  },
  methods: {
    toPre() {
      this.index -= 1;
    },
    toNext() {
      this.index += 1;
    },
    handleClose(){
      this.index = 1;
      this.$emit('close')
    }
  }
};
</script>

<style scoped lang="scss">
>>> .dia-review {
  width: 56vh;
  height: 80vh;
  margin-top: 0 !important;
  top: 50%;
  transform: translateY(-50%);
  .review {
    height: 70vh;
    width: 49vh;
    border: 1px solid #c894f0;
    margin: 0 auto;
    position: relative;
    box-shadow: 5px 5px 20px #f3b6cc;
    .review-page {
      width: 100%;
      height: 100%;
    }
  }
  .svg {
    width: 36px;
    height: 36px;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0.3;
    &:hover {
      opacity: 1;
    }
  }
  .svg-left {
    left: 0px;
  }
  .svg-right {
    right: 0px;
  }
  .page-index {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
  .el-dialog__body {
    padding: 0;
  }
}
</style>
