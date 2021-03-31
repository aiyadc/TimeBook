<template>
  <div class="folder" :tabindex="-1">
    <img class="svg-folder" src="../icons/album.svg" @click="toFolder" alt="" />
    <div class="more" :tabindex="-2" v-if="showEdit">
      <div class="box-more">
        <i class="el-icon-edit" @click="handleEdit"></i>
        <i class="el-icon-delete" @click="handleDelete"></i>
      </div>
      <img class="svg-more" src="../icons/more.svg" @click="showMoreTool" />
    </div>
    <span class="folder-name">{{ name }}</span>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    src: String, // 图片地址
    name: String, // 文件夹名称
    showEdit:{
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
    // 点击该目录触发
    toFolder() {
      this.$emit("folder-click");
    },
    // 点击编辑图标触发
    handleEdit() {
      this.$emit("edit");
    },
    // 点击删除图标触发
    handleDelete() {
      this.$emit("delete");
    },
    // 展示功能图标
    showMoreTool(e) {
      let t = e.target.parentElement.getElementsByClassName("box-more")[0];
      console.log("t.style.display :>> ", t.style.display);
      if (!t.style.display || t.style.display == "none") {
        t.style.display = "inline-block";
      } else {
        console.log("aaa");
        t.style.display = "none";
      }
    }
  }
};
</script>

<style scoped lang="scss">
.folder {
  display: inline-block;
  cursor: pointer;
  width: 76px;
  height: 80px;
  margin: 5px;
  position: relative;
  -webkit-tap-highlight-color: transparent;
   .svg-folder {
    width: 76px;
    height: 70px;
  }
  .more {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 99;
    &:active,
    &:hover {
      .box-more {
        display: inline-block;
      }
    }
    .box-more {
      position: relative;
      bottom: 3px;
      margin-right: 5px;
      background-color: rgba(255, 199, 199, 1);
      display: none;
      i {
        &:active,
        &:hover {
          outline: tomato solid 1px;
        }
      }
    }
    .svg-more {
      width: 18px;
      height: 18px;
      opacity: 0.5;
      &:active {
        opacity: 1;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
  span {
    font-size: 12px;
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
  }
  &:focus {
    outline: #ffc5c5 2px solid;
  }
}
</style>
