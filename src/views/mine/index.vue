<!-- 我的 -->
<template>
  <div class="mine">
    <div class="head">
      <img class="banner" :src="userInfo.bg_url" alt="" />
      <div class="info">
        <el-image class="avatar" :src="userInfo.avatar_url"></el-image>
        <div class="words">
          <span class="nickname">{{ userInfo.nickname }}</span> <br />
          <span class="signature">{{ userInfo.signature }}</span>
        </div>
      </div>
    </div>
    <div class="content" v-loading="reviewLoading">
      <el-tabs v-model="tab" @tab-click="handleTabClick">
        <el-tab-pane label="我的设计" name="design">
          <div class="album-list">
            <album
              v-for="(album, i) in albumList"
              :src="album.cover_url"
              :name="album.name"
              :theme="getThemeName(album.tid)"
              :count="album.count"
              :has-delete="true"
              :isfavor="favorAids && favorAids.includes(album.aid)"
              :ish5="service === 'h5'"
              :key="i"
              @review="toReview(album.aid)"
              @todesign="toDesign(album.aid)"
              @heartclick="handleHeartClick($event, album.aid)"
              @delete="deleteAlbum(album.aid)"
            ></album>
          </div>
        </el-tab-pane>
        <el-tab-pane label="喜欢" name="favor">
          <div class="album-list">
            <album
              v-for="(album, i) in favorList"
              :src="album.cover_url"
              :name="album.name"
              :theme="getThemeName(album.tid)"
              :count="album.count"
              :isfavor="favorAids.includes(album.aid)"
              :ish5="service === 'h5'"
              :key="i"
              @review="toReview(album.aid)"
              @todesign="toDesign(album.aid)"
              @heartclick="handleHeartClick($event, album.aid)"
            ></album>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 预览弹窗 -->
    <review
      :data-list="reviewList"
      :visible="reviewDia"
      :ish5="service == 'h5'"
      @close="closeReview"
    ></review>
  </div>
</template>

<script>
import albumRequest from "@/api/album.js";
import favorRequest from "@/api/favor.js";
import themeRequest from "@/api/theme.js";
import userRequest from "@/api/user.js";
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
      albumList: [], // 相册列表
      favorList: [], // 收藏列表
      favorAids: [], // 收藏的相册的aid列表
      themeList: [], // 主题列表
      reviewDia: false,
      reviewList: [], // 预览相册页列表
      reviewLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      }
    };
  },

  computed: {
    uid() {
      return this.$store.state.uid;
    },
    service() {
      return this.$store.state.platform;
    }
  },
  created() {
    console.log("Review :>> ", Review);
    // this.uid = this.$store.state.uid; //同步用户id
    this.init();
  },
  mounted() {},

  methods: {
    handleTabClick(tab) {
      if (tab.name == "favor") {
        this.getFavorList();
      } else if (tab.name == "design") {
        this.getMyAlbums();
      }
    },
    init() {
      // 拉取我的信息
      this.getUserInfo();
      // 拉取我的设计
      this.getMyAlbums();
      // 拉取收藏列表
      this.getFavorList();
      // 拉取主题列表
      this.getThemeList();
    },
    // 拉取用户信息
    getUserInfo() {
      userRequest.getUserInfo(this.uid).then(res => {
        this.userInfo = res.data;
      });
    },
    // 获取我的相册本
    getMyAlbums() {
      albumRequest.getMyAlbums(this.uid).then(res => {
        this.albumList = res.data;
      });
    },
    // 获取相册预览列表
    toReview(aid) {
      this.reviewLoading = true;
      albumRequest.getReviewInfo(aid).then(res => {
        this.reviewList = res.data.map(item => {
          return item.src;
        });
        this.reviewDia = true;
        this.reviewLoading = false;
      });
    },
    // 关闭预览弹框
    closeReview() {
      this.reviewDia = false;
    },
    // 获取主题列表:
    getThemeList() {
      themeRequest.getThemeList().then(res => {
        this.themeList = res.data;
      });
    },
    // 获取主题名字
    getThemeName(tid) {
      let theme = this.themeList.find(theme => theme.tid == tid);
      return theme && theme.name;
    },
    // 获取收藏列表
    getFavorList() {
      favorRequest.getFavorList(this.uid).then(res => {
        this.favorList = res.data;
        this.favorAids = res.data.map(album => {
          return album.aid;
        });
        this.favorAids = this.favorAids || [];
        console.log("this.favorAids :>> ", this.favorAids);
      });
    },
    // 进入设计
    toDesign(aid) {
      this.$router.push({
        name: "diy",
        params: { aid }
      });
    },
    // 收藏或取消收藏
    handleHeartClick(isfavor, aid) {
      console.log("isfavor :>> ", isfavor, Array.from(this.favorAids));
      if (isfavor) {
        this.favorAids.forEach((val, i, list) => {
          if (val == aid) {
            list.splice(i, 1);
          }
        });
      } else {
        this.favorAids.push(aid);
        this.favorAids.sort();
      }
      favorRequest.handleFavor(this.uid, isfavor, aid);
    },
    // 删除相册
    deleteAlbum(aid) {
      this.$confirm("确定要删除相册吗", "提示", {
        type: "warning",
        cancelButtonText: "害，是的",
        confirmButtonText: "再想想"
      }).catch(() => {
        console.log("删除");
        albumRequest.deleteAlbum(this.uid, aid).then(res => {
          this.$message.success(res.message);
          this.albumList.forEach((album, i, list) => {
            if (album.aid == aid) {
              list.splice(i, 1);
            }
          });
        });
      });
    },
    // 页面改变时触发
    changePage(val) {
      console.log(val);
      this.currentPage = val;
    }
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
      display: flex;
      align-items: center;
      text-align: left;
      .avatar {
        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        vertical-align: middle;
        display: inline-block;
      }
      .words {
        display: inline-block;
        margin-left: 10px;
        text-align: left;
        .nickname {
          font-size: 14px;
        }
        .signature {
          font-size: 10px;
        }
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
  & >>> .el-tabs__header {
    margin: 0 10px 15px;
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
