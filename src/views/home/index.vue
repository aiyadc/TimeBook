<!-- Home -->
<template>
  <div class="home">
    <div class="head">
      <div class="tool">
        <el-input
          class="search"
          v-model="search"
          placeholder="请输入关键字进行搜索"
        >
        </el-input>
        <i class="el-icon-search left40" @click="queryByName"></i>
        <el-button
          class="create"
          :type="service == 'h5' ? 'text' : 'primary'"
          icon="el-icon-plus"
          @click="handleAddClick"
          >新建</el-button
        >
      </div>
      <ul class="theme-list">
        <span v-if="service == 'pc'">分类：</span>
        <li v-for="(theme, i) in themeList" :key="i" :tabindex="i">
          {{ theme.name }}({{ theme.count }})
        </li>
      </ul>
    </div>
    <div class="album-list" @scroll="handleScroll">
        <album
          v-for="(album, i) in albumList"
          :src="album.cover_url"
          :name="album.name"
          :aid="album.aid"
          :theme="getThemeName(album.tid)"
          :count="album.count"
          :isfaovr="favorList.includes(album.aid)"
          :ish5="service === 'h5'"
          :key="i"
          @heartclick="handleFavor(album.aid)"
          @review="toReview(album.aid)"
          @todesign="toDesign(album.aid)"
        ></album>
    </div>
    <el-pagination
      class="pagination pc"
      prev-text="上一页"
      next-text="下一页"
      :current-page.sync="pagination.currentPage"
      :page-size="100"
      layout="prev, pager, next, jumper"
      :total="pagination.total"
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
    <el-dialog title="创建" :visible.sync="createDia" v-loading="loading1">
      <el-form :model="albumForm">
        <el-form-item label="相册名称">
          <el-input
            v-model="albumForm.name"
            placeholder="为你的相册取一个好听的名称吧~"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-select v-model="albumForm.tid" placeholder="与相册相关的主题">
            <el-option
              v-for="(t, i) in themeOptions"
              :key="i"
              :label="t.name"
              :value="t.tid"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页数：" v-if="createMode == 'empty'">
          <el-input
            v-model="albumForm.count"
            placeholder="非vip用户默认10页（待验证）"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="albumForm.remark" placeholder="备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="createMode == 'empty' ? createAlbum() : createByTemplate()"
          >确定</el-button
        >
        <el-button type="default">取消</el-button>
      </div>
    </el-dialog>
    <!-- <el-button type="primary" plain @click="goDIY">设计</el-button> -->
  </div>
</template>

<script>
import themeRequest from "@/api/theme.js";
import albumRequest from "@/api/album.js";
import favorRequest from "@/api/favor.js";
import Album from "@/components/Album/index.vue";
import Review from "@/components/Review/index.vue";
export default {
  components: {
    Album,
    Review
  },
  data() {
    return {
      search: "",
      themeList: [], // 主题列表
      themeOptions: [], //主题展示列表
      albumList: [], // 相册列表
      lastAlbum:null, // 最后一个相册，用于监听滚动
      favorList: [], // 收藏列表
      reviewList: [], // 预览列表
      createMode: "empty", // 创建方式，‘template’/‘empty’
      templateID: 0, // 借鉴的模板ID
      albumForm: {
        name: "",
        tid: "",
        count: 10,
        remark: ""
      },
      themeOptions: [],
      // Dialog
      reviewDia: false,
      createDia: false,
      // Loading
      loading1: false,
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  computed: {
    service() {
      return this.$store.state.platform;
    },
    uid() {
      return this.$store.state.uid;
    }
  },
  created() {
    this.init();
    console.log("review :>> ", Review);
  },
  mounted() {
    console.log("this.$store.state.uid :>> ", this.$store.state.uid, this.uid);
    console.log("this.service :>> ", this.service);
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
      this.getAlbumTemplateList(0);
      // 拉取收藏列表
      this.getFavorList();
    },
    // 获取主题列表:
    getThemeList() {
      themeRequest.getThemeList().then(res => {
        this.themeOptions = res.data;
        console.log("themeOptions :>> ", this.themeOptions);
        this.themeList = Array.from(res.data);
        let count = res.data.reduce((pre, cur) => {
          return pre + cur.count;
        }, 0);
        this.themeList.unshift({
          tid: 0,
          name: "全部",
          count: count
        });
      });
    },
    // 获取模板相册列表
    getAlbumTemplateList(tid) {
      let params = {};
      params.tid = tid;
      params.currentPage = this.pagination.currentPage;
      albumRequest.getAlbumTemplateList(params).then(res => {
        this.albumList = res.data;
        let len = res.data.length;
        this.lastAlbum = len?res.data[len-1]:null;
      });
    },
    // 获取收藏列表
    getFavorList() {
      favorRequest.getFavorList(this.uid).then(res => {
        this.favorList = res.data;
      });
    },
    // 搜索
    queryByName() {
      // todo
    },
    // 处理新建事件
    handleAddClick() {
      this.createMode = "empty";
      this.createDia = true;
    },
    // 创建相册
    createAlbum() {
      this.loading1 = true;
      console.log("this.albumForm :>> ", this.albumForm);
      console.log("this.uid :>> ", this.uid);
      albumRequest.createAlbum(this.albumForm, this.uid).then(res => {
        this.loading1 = false;
        this.$router.push({
          name: "diy",
          params: { aid: res.data.aid }
        });
      });
    },
    // 添加收藏
    handleFavor(bool, aid) {
      if (bool) {
        favorRequest.addFavor(this.uid, aid).then(res => {
          console.log("res :>> ", res);
        });
      } else {
        favorRequest.deleteFavor(this.uid, aid).then(res => {
          console.log("res :>> ", res);
        });
      }
    },
    // 获取相册预览列表
    toReview(aid) {
      albumRequest.getReviewInfo(aid).then(res => {
        this.reviewList = res.data.map(item => {
          return item.src;
        });
        console.log("this.reviewList :>> ", this.reviewList);
        this.reviewDia = true;
      });
    },
    // 关闭预览弹框
    closeReview() {
      this.reviewDia = false;
    },
    // 以模板样式进入设计页面
    toDesign(aid) {
      this.createMode = "template";
      this.createDia = true;
      this.templateID = aid;
    },
    //以模板方式创建相册
    createByTemplate() {
      this.loading1 = true;
      let data = Object.assign({}, this.albumForm);
      delete data.count;
      console.log("data :>> ", data);
      albumRequest
        .createAlbum(data, this.uid, this.templateID)
        .then(res => {
          this.loading1 = false;
          this.$router.push({
            name: "diy",
            params: { aid: res.data.aid }
          });
        })
        .catch(() => {
          this.loading1 = false;
        });
    },

    // 获取主题名字
    getThemeName(tid) {
      let theme = this.themeOptions.find(theme => theme.tid == tid) || {};
      return theme.name;
    },
    // 页面改变时触发
    changePage(val) {
      console.log(val);
      this.currentPage = val;
    },
    // 监听滚动事件
    handleScroll(e) {
      console.log("滚动", e);

    }
  }
};
</script>
<style lang="scss" scoped>
.head {
  background-color: #f9c8df;
  .tool {
    padding: 10px;
    background-color: #f9c8df;
    white-space: nowrap;
    .search {
      width: 24rem;
      display: inline-block;
    }
    .left40 {
      position: relative;
      right: 40px;
      cursor: pointer;
    }
    .create {
      float: right;
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
        //border: 1px solid white;
        background-color: #d176de7a;
        outline: none;
      }
    }
  }
}
.album-list {
  padding: 10px;
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  height: calc(100vh - 128px);
  overflow-y: auto;
}
.pagination {
  margin-top: 20px;
}
@media screen and (max-width: 700px) {
  .head {
    background-color: #fff;
    text-align: left;
    font-size: 14px;
    .tool {
      .search {
        width: calc(100vw - 100px);
      }
    }
    .theme-list {
      padding: 0;
    }
  }
  .album-list {
    width: 100vw;
    // height: ;
    padding: 0;
    display: flex;
    justify-content: space-around;
  }
  .home >>> .dia-review {
    width: 100vw;
    height: 100vh;
  }
}
</style>
