<!-- Home -->
<template>
  <div class="home" v-loading="getTempLoading">
    <div class="head">
      <div class="header">
        <img class="logo" src="@/assets/logo.png" v-if="service == 'pc'" />
        <!-- <span class="logo">DIY</span> -->
        <span v-else>模板</span>
        <!-- <i class="el-icon-plus create" @click="handleAddClick"></i> -->
        <div class="right">
          <div class="search">
            <el-input
              class="content"
              size="small"
              v-model="search"
              placeholder="请输入关键字进行搜索"
            >
            </el-input>
            <i
              class="el-icon-search search-icon"
              @click="
                service == 'h5'
                  ? getTemplateListH5(tid)
                  : getTemplateListPC(tid)
              "
            ></i>
          </div>
          <el-button
            class="create"
            size="small"
            icon="el-icon-plus"
            @click="handleAddClick"
            v-if="service == 'pc'"
          >
            新建
          </el-button>

          <i class="el-icon-plus create" @click="handleAddClick" v-else> </i>
          <!-- 头像 -->
          <avatar :src="avatar_url"></avatar>
        </div>
      </div>
      <ul class="theme-list">
        <span v-if="service == 'pc'">分类：</span>
        <li tabindex="-1" @click="handleThemeClick(0, 0)">全部</li>
        <li
          v-for="(theme, i) in themeOptions"
          :key="i"
          :tabindex="i"
          @click="handleThemeClick(theme.tid, i + 1)"
        >
          {{ theme.name }}
        </li>
      </ul>
    </div>
    <div class="album-list" @scroll="handleScroll">
      <p class="loading-show h5" v-if="getTempLoading">加载中...</p>
      <album
        class="album"
        v-for="(album, i) in albumList"
        :src="album.cover_url"
        :name="album.name"
        :aid="album.aid"
        :theme="getThemeName(album.tid)"
        :count="album.count"
        :isfavor="favorList.includes(album.aid)"
        :ish5="service === 'h5'"
        :key="i"
        @heartclick="handleFavor($event, album.aid)"
        @review="toReview(album.aid)"
        @todesign="toDesign(album.aid)"
      ></album>
    </div>
    <el-pagination
      class="pagination pc"
      :current-page.sync="pagination.currentPage"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      prev-text="上一页"
      next-text="下一页"
      layout="prev, pager, next, jumper"
      @current-change="changePage"
    >
    </el-pagination>
    <!-- 预览相册弹窗 -->
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
          <el-input v-model="createForm.name" placeholder="相册名称"></el-input>
        </el-form-item>
        <el-form-item label="主题：" prop="tid" required>
          <el-select v-model="createForm.tid" placeholder="与相册相关的主题">
            <el-option
              v-for="(t, i) in themeOptions"
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
          v-if="createMode == 'empty'"
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
        <el-button
          type="primary"
          @click="createMode == 'empty' ? createAlbum() : createByTemplate()"
          >确定</el-button
        >
        <el-button type="default" @click="createDia = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- <el-button type="primary" plain @click="goDIY">设计</el-button> -->
  </div>
</template>

<script>
import dom from "@/utils/dom.js";
import themeRequest from "@/api/theme.js";
import albumRequest from "@/api/album.js";
import favorRequest from "@/api/favor.js";
import { mapState } from "vuex";
import convert from "@/utils/convert.js";
import Album from "@/components/Album/index.vue";
import Review from "@/components/Review/index.vue";
import Avatar from "@/components/Avatar";
export default {
  components: {
    Album,
    Review,
    Avatar
  },
  data() {
    return {
      search: "",
      tid: null, // 当前选择的主题
      themeList: [], // 主题列表
      themeOptions: [], //主题展示列表
      albumList: [], // 相册列表
      lastAlbum: null, // 最后一个相册，用于监听滚动
      favorList: [], // 收藏列表
      reviewList: [], // 预览列表
      createMode: "empty", // 创建方式，‘template’/‘empty’
      templateID: 0, // 借鉴的模板ID
      createForm: {
        name: "",
        tid: "",
        count: 10,
        remark: ""
      },
      themeOptions: [],
      debounce: null,
      // Dialog
      reviewDia: false,
      createDia: false,
      // Loading
      createLoading: false,
      getTempLoading: false,
      pageloading: false,
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        tpid: 0
      }
    };
  },
  computed: {
    service() {
      return this.$store.state.platform;
    },
    ...mapState({
      uid: state => state.user.uid,
      isvip: state => state.user.isvip,
      avatar_url: state => state.user.avatar_url
    })
  },
  created() {
    this.init();
  },
  mounted() {
    this.debounce = dom.debounce(this.getNextPage, 50);
    this.$nextTick(() => {
      const themeList = document.getElementsByClassName("theme-list")[0];
      const li0 = themeList.getElementsByTagName("li")[0];
      li0.classList.add("selected");
    });
  },

  methods: {
    goDIY() {
      this.$router.push("/diy");
    },
    // 初始化页面
    init() {
      // 拉取主题列表
      this.getThemeList();
      // 拉取模板相册列表
      this.handleThemeClick(0, 0);
      // 拉取收藏列表
      this.getFavorList();
    },
    // 获取主题列表:
    getThemeList() {
      themeRequest.fetchThemes().then(res => {
        this.themeOptions = res.data;
      });
    },
    // PC端：根据页数获取模板相册列表
    async getTemplateListPC(tid) {
      let params = {};
      params.tid = tid;
      params.currentPage = this.pagination.currentPage;
      params.pageSize = this.pagination.pageSize;
      params.search = this.search;
      this.getTempLoading = true;
      await albumRequest
        .getTemplateList(params)
        .then(res => {
          this.albumList = res.data;
          this.getTempLoading = false;
          this.pagination.total = res.pagination.totalCount;
          console.log("this.pagination :>> ", this.pagination);
        })
        .catch(() => {
          this.getTempLoading = false;
        });
    },
    // 移动端：滚动加载，根据最后一条tpid来获取
    async getTemplateListH5(tid, tpid = 0) {
      let params = {};
      params.tid = tid;
      params.tpid = tpid;
      params.pageSize = this.pagination.pageSize;
      params.search = this.search;
      this.getTempLoading = true;
      await albumRequest
        .getTemplateList(params)
        .then(res => {
          this.albumList = this.albumList.concat(res.data);
          this.getTempLoading = false;
          this.pagination.tpid = this.albumList[this.albumList.length - 1].tpid;
          this.$nextTick(() => {
            let albumEleList = document.getElementsByClassName("album");
            this.lastAlbum = albumEleList[albumEleList.length - 1] || null;
          });
        })
        .catch(() => {
          this.getTempLoading = false;
        });
    },
    // 获取收藏列表
    getFavorList() {
      favorRequest.getFavorList(this.uid).then(res => {
        this.favorList = res.data.map(album => {
          return album.aid;
        });
      });
    },
    // 搜索
    queryByName() {
      albumRequest.searchTemplate(this.search).then(res => {
        this.albumList = res.data;
      });
    },
    // 处理新建事件
    handleAddClick() {
      this.createMode = "empty";
      this.createDia = true;
    },
    // 创建相册
    createAlbum() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          if (this.createForm.count < 10 || this.createForm.count > 100) {
            this.$message.error("页数的范围为10~100噢");
            return;
          }
          this.createLoading = true;
          albumRequest
            .createAlbum(this.createForm, this.uid)
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
        } else {
          return;
        }
      });
    },
    // 添加收藏
    handleFavor(isfavor, aid) {
      if (isfavor) {
        this.favorList.forEach((val, i, list) => {
          if (val == aid) {
            list.splice(i, 1);
          }
        });
      } else {
        this.favorList.push(aid);
        this.favorList.sort();
      }
      favorRequest.handleFavor(this.uid, isfavor, aid);
    },
    // 获取相册预览列表
    toReview(aid) {
      this.getTempLoading = true;
      albumRequest
        .getReviewInfo(aid)
        .then(res => {
          this.reviewList = res.data.map(item => {
            return item.src;
          });
          this.getTempLoading = false;
          this.reviewDia = true;
        })
        .catch(() => {
          this.getTempLoading = false;
        });
    },
    // 关闭预览弹框
    closeReview() {
      this.reviewDia = false;
    },
    // 以模板样式进入设计页面
    toDesign(aid) {
      this.createForm.count = this.albumList.find(
        album => album.aid == aid
      ).count;
      this.createMode = "template";
      this.createDia = true;
      this.templateID = aid;
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
    // 获取主题名字
    getThemeName(tid) {
      let theme = this.themeOptions.find(theme => theme.tid == tid) || {};
      return theme.name;
    },
    // 处理点击主题事件
    async handleThemeClick(tid, index) {
      const themeList = document.getElementsByClassName("theme-list")[0];
      let liList = (themeList && themeList.getElementsByTagName("li")) || [];
      for (let i = 0; i < liList.length; i++) {
        liList[i].classList.remove("selected");
        if (i == index) liList[i].classList.add("selected");
      }
      if (this.tid == tid) return;
      this.tid = tid;
      this.albumList = [];
      if (this.service == "h5") {
        await this.getTemplateListH5(tid, 0);
      } else {
        await this.getTemplateListPC(tid);
      }
    },
    // 页面改变时触发
    changePage(val) {
      this.currentPage = val;
      this.getTemplateListPC(this.tid, val);
    },
    // 检测最后一本相册的位置，如果到达了边界就拉取下一页的内容
    getNextPage(bottom) {
      if (bottom > -20 && bottom < 10) {
        this.pagination.currentPage += 1;
        let params = {};
        params.tid = this.tid;
        params.tpid = this.pagination.tpid;
        params.pageSize = this.pagination.pageSize;
        this.getTempLoading = true;
        albumRequest.getTemplateList(params);
      }
    },
    // 监听滚动事件
    handleScroll(e) {
      const albumList = document.getElementsByClassName("album-list")[0];
      let bottom =
        this.lastAlbum.getBoundingClientRect().bottom -
        albumList.clientHeight -
        100;
      const res = this.debounce(bottom)
        .then(res => {
          this.albumList = this.albumList.concat(res.data);
          this.pagination.tpid = res.data.tpid;
          this.getTempLoading = false;
          this.$nextTick(() => {
            let albumEleList = document.getElementsByClassName("album");
            this.lastAlbum = albumEleList[albumEleList.length - 1] || null;
          });
        })
        .catch(() => {
          this.getTempLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100vh;
}
.head {
  background-color: #f9c8df;
  text-align: left;
  .header {
    padding: 10px;
    background-color: #f9c8df;
    white-space: nowrap;
    position: relative;
    .logo {
      font-size: 32px;
      vertical-align: middle;
      color: #f1a895;
    }

    .right {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      .search {
        display: inline-block;
        .content {
          width: 7rem;
          min-width: 200px;
          display: inline-block;
        }

        .search-icon {
          position: relative;
          right: 40px;
          vertical-align: middle;
          cursor: pointer;
        }
      }
      .create {
        background-color: #8adc97bf;
        vertical-align: middle;
      }
    }
  }
  .theme-list {
    width: 100vw;
    margin: 0;
    overflow-x: auto;
    white-space: nowrap;
    list-style-type: none;
    font-size: 14px;
    text-align: left;
    span {
      font-weight: 700px;
    }
    li {
      display: inline-block;
      margin: 5px 10px;
      cursor: pointer;
      border-radius: 8px;
      padding: 5px;
      &:active,
      &:hover,
      &:focus {
        background-color: #d176de7a;
        outline: none;
      }
    }
    .selected {
      background-color: #d176de7a;
      outline: none;
    }
  }
}
.album-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  overflow-y: auto;
  .loading-show {
    width: 100vw;
  }
}
.tips {
  font-size: 12px;
  color: #7d8c87;
}
@media screen and (max-width: 768px) {
  .head {
    background-color: #fff;
    text-align: left;
    font-size: 14px;
    .header {
      .right {
        .search {
        }
        .create {
          padding: 8px;
          border-radius: 50%;
        }
      }
    }
    .theme-list {
      padding: 0;
    }
  }
  .album-list {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    grid-column-gap: 0;
  }
  .home >>> .dia-review {
    width: 100vw;
    height: 100vh;
  }
  .home >>> .dia-create {
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
