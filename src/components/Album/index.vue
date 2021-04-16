<template>
  <div class="album">
    <div class="cover" @click="ish5 ? toDesign : void 0">
      <img :src="src" />
      <div class="mask">
        <span class="review" @click="handleReview">预览</span>
        <div class="handler">
          <div @click="toDesign">
            <img src="./icons/draw.svg" />
            <span>设计</span>
          </div>
          <div @click="toDelete" v-if="hasDelete">
            <img src="./icons/delete.svg" alt="" />
            <span>删除</span>
          </div>
        </div>
        <!-- <el-button
          class="design"
          type="primary"
          size="small"
          @click="toDesign"
        >
          进入设计
        </el-button> -->
      </div>
    </div>
    <div class="info">
      <div class="row1">
        <span class="name ellipsis">{{ name }}</span>
        <img
          class="heart"
          src="./icons/heart_white.svg"
          @click="handleHeartClick(0)"
          v-if="!isfavor"
        />
        <img
          class="heart"
          src="./icons/heart_pink.svg"
          @click="handleHeartClick(1)"
          alt=""
          v-else
        />
      </div>
      <div class="row2">
        <span class="theme ellipsis">主题:{{ theme }}</span>
        <span class="count">{{ count || 0 }}页</span>
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
    hasDelete: {
      type: Boolean,
      default: false
    },
    ish5: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleHeartClick(bool) {
      this.$emit("heartclick", bool);
    },
    handleReview() {
      this.$emit("review");
    },
    toDesign() {
      this.$emit("todesign");
    },
    toDelete() {
      this.$emit("delete");
    }
  }
};
</script>

<style scoped lang="scss">
.album {
  display: inline-block;
  width: 6rem;
  height: calc(6rem + 44px);
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
      background-color: rgba(96, 92, 92, 0.6);
    }
    img {
      width: 4.2rem;
      height: 100%;
    }
    .handler {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      display: none;
      div {
        width: 50px;
        vertical-align: middle;
        cursor: pointer;
        img {
          display: block;
          margin: auto;
          width: 24px;
        }
        span {
          font-size: 12px;
        }
        &:active,
        &:hover {
          transform: scale(1.2);
        }
      }
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
      .review {
        display: inline-block;
      }
      .handler {
        display: flex;
        justify-content: space-around;
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
      display: flex;
      justify-content: space-between;
      .theme,
      .count {
        display: inline-block;
        vertical-align: middle;
        font-size: 10px;
        color: #494343ee;
      }
      .theme {
        width: 4rem;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .album {
    width: 7rem;
    height: calc(7rem + 44px);
    .cover {
      width: 7rem;
      height: 7rem;
      img {
        width: 4.9rem;
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
