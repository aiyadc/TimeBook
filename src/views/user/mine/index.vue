<!-- 我的 -->
<template>
  <div class="mine">
    <div class="container">
      <div class="nav ">
        <el-input
          class="search"
          v-model="search"
          placeholder="输入相册名搜索"
          prefix-icon="el-icon-search"
        ></el-input>
        <div class="right">
          <el-button
            class="to-template"
            type="text"
            @click="$router.push('/template')"
          >
            模板页</el-button
          >
          <avatar :src="avatar_url"></avatar>
        </div>
      </div>
      <div class="head">
        <div class="info">
          <div class="header">
            <div class="left">
              <span class="nickname">{{ userInfo.nickname }}</span
              ><br />
              <span class="signature">个性签名：{{ userInfo.signature }}</span>
            </div>
            <div class="right">
              <el-button type="default" size="small">编辑</el-button>
            </div>
          </div>
          <hr style="opacity: .4;" />
          <div class="content">
            <div class="left">
              <div class="design">
                <span class="count">{{ albumList.length }}</span
                ><br />
                <span class="label">设计</span>
              </div>
              <div class="favor">
                <span class="count">{{ favorList.length }}</span
                ><br />
                <span class="label">收藏</span>
              </div>
              <div class="base-info">
                <p>
                  <span>邮箱：</span><span>{{ userInfo.mail }}</span>
                </p>
                <p>
                  <span>手机号：</span><span>{{ userInfo.mobile }}</span>
                </p>
                <p>
                  <span>我的地址：</span><span>{{ userInfo.address }}</span>
                </p>
              </div>
            </div>
            <div class="right">
              <el-image
                class="avatar"
                :src="
                  userInfo.avatar_url
                    ? userInfo.avatar_url
                    : require('@/assets/cc.jpg')
                "
              ></el-image
              ><br />
              <span>头像</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content" v-loading="reviewLoading">
        <el-tabs v-model="tab" @tab-click="handleTabClick">
          <el-tab-pane label="我的设计" name="design">
            <div class="album-list">
              <album
                v-for="(album, i) in albumListFilter"
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
                :isfavor="favorAids && favorAids.includes(album.aid)"
                :ish5="service === 'h5'"
                :key="i"
                @review="toReview(album.aid)"
                @todesign="createAlbum(album.aid, album.tid)"
                @heartclick="handleHeartClick($event, album.aid)"
              ></album>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <review
      :data-list="reviewList"
      :visible="reviewDia"
      :ish5="service == 'h5'"
      @close="closeReview"
    ></review>
    <!-- 创建相册 -->
    <el-dialog
      custom-class="dia-create"
      title="创建"
      :visible.sync="createDia"
      v-loading="createLoading"
      center
    >
      <el-form :model="createForm" label-width="70px" ref="createForm">
        <el-form-item label="名称：" prop="name" required>
          <el-input
            v-model="createForm.name"
            placeholder="为你的相册取一个好听的名称吧~"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题：" prop="tid" required>
          <el-select v-model="createForm.tid" placeholder="与相册相关的主题">
            <el-option
              v-for="(t, i) in themeList"
              :key="i"
              :label="t.name"
              :value="t.tid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="页数："
          prop="count"
          required
          :rules="[{ type: 'number', message: '页数必须为10~100的数字' }]"
        >
          <el-input
            v-model.number="createForm.count"
            placeholder="请输入相册的页数"
            :disabled="isvip == 0"
          ></el-input>
          <span class="tips" v-if="isvip === 0"> *非vip用户默认10页</span>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="createForm.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="createByTemplate()">确定</el-button>
        <el-button type="default" @click="createDia = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import albumRequest from "@/api/album.js";
import favorRequest from "@/api/favor.js";
import themeRequest from "@/api/theme.js";
import userRequest from "@/api/user.js";
import { mapState } from "vuex";
import Album from "@/components/Album/index.vue";
import Review from "@/components/Review/index.vue";
import Avatar from "@/components/Avatar";
import convert from "@/utils/convert.js";
export default {
  components: {
    Album,
    Review,
    Avatar
  },

  data() {
    return {
      userInfo: {},
      tab: "design",
      isfavor: true,
      templateID: 0, // 借鉴的模板ID
      createForm: {
        name: "",
        tid: "",
        count: 10,
        remark: ""
      },
      albumList: [], // 相册列表
      favorList: [], // 收藏列表
      favorAids: [], // 收藏的相册的aid列表
      themeList: [], // 主题列表
      reviewDia: false,
      createDia: false,
      reviewList: [], // 预览相册页列表
      reviewLoading: false,
      createLoading: false,
      search: "",
      banner: null,
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      }
    };
  },

  computed: {
    ...mapState({
      uid: state => state.user.uid,
      identity: state => state.user.identity,
      avatar_url: state => state.user.avatar_url,
      isvip: state => state.user.isvip
    }),
    service() {
      return this.$store.state.platform;
    },
    albumListFilter() {
      return this.albumList.filter(album => {
        let theme = this.themeList.find(theme => theme.tid == album.tid);
        return (
          album.name.toLowerCase().includes(this.search.trim()) ||
          (theme && theme.name).toLowerCase().includes(this.search)
        );
      });
    }
  },
  created() {
    this.init();
  },
  mounted() {
    this.banner = document.getElementsByClassName("head")[0];
  },
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
      themeRequest.fetchThemes().then(res => {
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
      });
    },
    // 创建相册
    createAlbum(aid, tid) {
      const album = this.albumList.find(album => album.tid == tid);
      if (album) {
        this.toDesign(album.aid);
        return;
      }
      this.createDia = true;
      this.templateID = aid;
      this.createForm.count = this.favorList.find(
        album => album.aid == aid
      ).count;
    },
    // 以模板方式创建相册
    createByTemplate() {
      this.createLoading = true;
      let data = Object.assign({}, this.createForm);
      delete data.count;
      albumRequest
        .createAlbum(data, this.uid, this.templateID)
        .then(res => {
          this.createLoading = false;
          this.$router.push({
            name: "diy",
            params: { aid: convert.encrypt(res.data.aid) }
          });
        })
        .catch(() => {
          this.createLoading = false;
        });
    },
    // 进入设计
    toDesign(aid) {
      this.$router.push({
        name: "diy",
        params: { aid: convert.encrypt(aid) }
      });
    },
    // 收藏或取消收藏
    handleHeartClick(isfavor, aid) {
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
  .container {
    padding: 20px;
    height: 100%;
    // background-image: linear-gradient(45deg, #ececec, #f9f9f9);
  }
  .nav {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    & >>> .search {
      flex: 1;
      border: none;
      .el-input__prefix {
        display: inline-block;
        height: 40px;
      }
      input {
        border: none;
      }
    }
    .right {
      width: calc(1rem + 70px);
      text-align: center;
    }
    .to-template {
      color: #dd8cbb;
    }
  }
  .head {
    width: 100%;
    position: relative;
    // background-image: url("../../assets/moon.jpg");
    border-radius: 4px 4px 0 0;
    background-position: 50%;
    background-size: cover;
    background-repeat: no-repeat;

    .info {
      display: inline-block;
      width: 100%;
      padding: 10px;
      text-align: left;
      border: 1px solid #e9bdbd;
      .header {
        display: flex;
        padding: 0 10px;
        justify-content: space-between;
        align-items: center;
        .left {
          .nickname {
            font-size: 0.7rem;
            font-weight: 600;
            line-height: calc(1rem + 8px);
            margin-right: 10px;
            vertical-align: baseline;
          }
          .signature {
            font-size: 0.4rem;
            vertical-align: baseline;
          }
        }
      }
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left {
          text-align: left;
          .design,
          .favor {
            display: inline-block;
            width: 2.5rem;
            height: 1.8rem;
            text-align: center;
            line-height: 1rem;
            border-right: 1px solid #8c7b7b;
            font-size: 0.5rem;
          }
          .base-info {
            margin-top: 20px;
            font-size: 0.4rem;
          }
        }
        .right {
          margin-right: 20px;
          text-align: center;
          .avatar {
            width: 5rem;
            height: 5rem;
            vertical-align: top;
          }
        }
      }
    }
  }
  .content {
    .album-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      grid-column-gap: 20px;
      grid-row-gap: 20px;
      overflow-y: auto;
    }
  }
  & >>> .el-tabs__header {
    margin: 0 10px 15px;
  }
}
@media screen and (max-width: 768px) {
  .mine {
    padding: 0;
    .content {
      .album-list {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        grid-column-gap: 0;
      }
    }
  }
  >>> .dia-create {
    margin-top: 0 !important;
    width: calc(100vw - 40px);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .el-dialog__body {
      padding: 20px;
    }
  }
}
</style>
