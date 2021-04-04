<!-- 我的 -->
<template>
  <div class="mine">
    <div class="head">
      <img class="banner" src="" alt="" />
      <div class="info">
        <el-image class="avatar" src=""></el-image>
        <div style="display:inline-block;">
          <span class="nickname">林一畅</span> <br />
          <span class="signature">要做最好看的页面</span>
        </div>
      </div>
    </div>
    <div class="content">
      <el-tabs v-model="tab" @click="handleTabClick">
        <el-tab-pane label="我的设计" name="design"
          >
          <div class="album-list">
            <album
              v-for="(album, i) in albumList"
              :src="album.cover_url"
              :name="album.name"
              :theme="album.theme"
              :count="album.count"
              :isfavor="isfavor"
              :ish5="service === 'h5'"
              :key="i"
              @review="toReview(album.aid)"
              @todesign="toDesign(album.aid)"
              @heartclick="handleHeartClick(album.aid)"
            ></album>
          </div>
        </el-tab-pane>
        <el-tab-pane label="喜欢" name="favorite"
          >喜欢
          <!-- 放入相册本组件 -->
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 预览弹窗 -->
  </div>
</template>

<script>
import albumRequest from "@/api/album.js";
import Album from "@/components/Album/index.vue";
import Review from "@/components/Review/index.vue";
export default {
  components: {
    Album,
    Review
  },

  data() {
    return {
      userInfo: {},
      tab: "design",
      isfavor: true,
      albumList: []
    };
  },

  computed: {
    uid() {
      return this.$store.state.uid;
    }
  },
  created() {
    this.uid = this.$store.state.uid; //同步用户id
    this.init();
  },
  mounted() {},

  methods: {
    handleTabClick(val) {
      console.log("tab:", val);
    },
    init() {
      // 拉取我的设计
      this.getMyAlbums();
    },
    // 获取我的相册本
    getMyAlbums() {
      albumRequest.getMyAlbums(this.uid).then(res => {
        this.albumList = res.data;
      });
    },
    // 预览相册
    toReview(aid) {
      // todo
    },
    // 点击收藏或取消收藏
    handleHeartClick(aid) {}
  }
};
</script>
<style lang="scss" scoped>
.mine {
  width: 100vw;
  height: 100vh;
  .head {
    width: 100%;
    height: 7rem;
    position: relative;
    .banner {
      width: 100%;
      height: 100%;
    }
    .info {
      position: absolute;
      left: 20px;
      bottom: 20px;
      .avatar {
        width: 4rem;
        height: 4rem;
        vertical-align: middle;
        display: inline-block;
      }
      .nickname {
        font-size: 14px;
      }
      .signature {
        font-size: 10px;
      }
    }
  }
  .content {

    .album-list {
      padding: 10px;
      display: flex;
      justify-content: start;
      flex-wrap: wrap;
    }
  }
}
@media screen and (max-width: 700px) {
  .mine {
    padding: 0;
    .content {
      .album-list {
        padding: 0;
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
