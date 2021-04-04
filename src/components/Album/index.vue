<template>
  <div class="album">
    <div class="cover" @click="ish5 ? toDesign : void 0">
      <img :src="src" />
      <div class="mask">
        <span class="review" @click="handleReview">预览</span>
        <el-button
          class="design"
          type="primary"
          size="small"
          @click="toDesign"
        >
          进入设计
        </el-button>
      </div>
    </div>
    <div class="info">
      <div class="row1">
        <span class="name ellipsis">{{ name }}</span>
        <img
          class="heart"
          src="./icons/heart_white.svg"
          @click="handleHeartClick(true)"
          v-if="isfavor"
        />
        <img
          class="heart"
          src="./icons/heart_pink.svg"
          @click="handleHeartClick(false)"
          alt=""
          v-else
        />
      </div>
      <div class="row2">
        <span class="theme ellipsis">主题:{{ theme }}</span>
        <span class="count">照片数：{{ count || 0 }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    src: String,
    name: String,
    theme: String,
    count: Number,
    isfavor: {
      type: Boolean,
      default: false
    },
    ish5: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleHeartClick(bool) {
      this.isfavor = !this.isfavor;
      this.$emit("heartclick",bool);
    },
    handleReview() {
      this.$emit("review");
    },
    toDesign() {
      this.$emit("todesign");
    }
  }
};
</script>

<style scoped lang="scss">
.album {
  width: 6rem;
  border: 1px solid #bab7b7;
  text-align: left;
  background-color: #d7ebfc;
  position: relative;
  margin: 10px;
  .cover {
    width: 6rem;
    height: 6rem;
    box-sizing: border-box;
    text-align: center;
    border: 1px solid #bab7b7;
    background-color: #f5f5f5;
    position: relative;
    right: 1px;
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      // z-index: 99;
      display: none;
      background-color: rgba(0, 0, 0, 0.6);
    }
    img {
      width: 4.2rem;
      height: 100%;
    }
    .design {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: none;
    }
    .review {
      display: inline-block;
      width: 40px;
      height: 22px;
      padding: 3px;
      border-radius: 17px;
      background-color: #fff;
      position: absolute;
      top: 10px;
      right: 10px;
      display: none;
      font-size: 10px;
      cursor: pointer;
      &:active,
      &:hover {
        color: #51bedb;
        cursor: pointer;
      }
    }
    &:active,
    &:hover {
      .design,
      .review {
        display: block;
      }
      .mask {
        display: block;
      }
    }
  }
  .info {
    .row1 {
      padding: 3px 5px 0 3px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        width: 4.2rem;
        font-size: 12px;
      }
      img {
        cursor: pointer;
        display: inline-block;
        width: 18px;
      }
    }
    .row2 {
      padding: 3px 5px 0 3px;
      .theme,
      .count {
        display: inline-block;
        vertical-align: middle;
        font-size: 8px;
        color: #494343ee;
      }
      .theme {
        width: 4rem;
      }
    }
  }
}
@media screen and (max-width: 700px) {
  .album {
    width: 42vw;
    .cover {
      width: 42vw;
      height: 70vw;
      img {
        width: 100%;
        height: 100%;
      }
      .review {
        display: block;
      }
    }
    .theme,
    .name {
      width: 2.4rem;
    }
  }
}
</style>
