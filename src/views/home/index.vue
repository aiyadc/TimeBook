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
        <li v-for="(theme, i) in themeList" :key="i">
          {{ theme.name }}({{ theme.count }})
        </li>
      </ul>
    </div>
    <div class="album-list">
      <div class="album" v-for="(album, i) in albumList" :key="i">
        <div class="cover-container">
          <img
            class="cover-pic"
            :src="album.cover_url"
            @click="toDesign(album.aid)"
          />
        </div>
        <div class="row1">
          <span class="name ellipsis">{{ album.name }}</span>
          <img
            class="heart"
            src="./icons/heart_white.svg"
            @click="addToFavorite"
            v-if="favorite.indexOf(album.aid) === -1"
          />
          <img
            class="heart"
            src="./icons/heart_pink.svg"
            @click="popFromFavorite(album.aid)"
            alt=""
            v-else
          />
        </div>
        <div class="row2">
          <span class="theme-name ellipsis">主题:{{ album.theme }}</span>
        </div>
        <el-button
          class="review"
          type="text"
          icon="el-icon-view"
          @click="toReview(album.aid)"
          >预览</el-button
        >
      </div>
    </div>
    <el-dialog
      custom-class="dia-review"
      :visible.sync="reviewDia"
      :fullscreen="service == 'h5'"
    >
      <span slot="title">My Album</span>
      <div class="review-pc">
        <img class="review-page" :src="reviewingPage.src" alt="" />
        <img
          class="svg svg-left"
          src="./icons/left.svg"
          @click="toPastPage"
          v-show="reviewingPage.pageIndex > 0"
        />
        <img
          class="svg svg-right"
          src="./icons/right.svg"
          @click="toNextPage"
          v-show="reviewingPage.pageIndex < reviewingAlbum.count - 1"
        />
        <span class="page-index"
          >{{ reviewingPage.pageIndex + 1 || 0 }}/{{
            reviewingAlbum.count || 0
          }}</span
        >
      </div>
    </el-dialog>
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
        <el-form-item label="页数：">
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
        <el-button type="primary" @click="createAlbum">确定</el-button>
        <el-button type="default">取消</el-button>
      </div>
    </el-dialog>
    <el-button type="primary" plain @click="goDIY">设计</el-button>
  </div>
</template>

<script>
import themeRequest from "@/api/theme.js";
import albumRequest from "@/api/album.js";
export default {
  data() {
    return {
      search: "",
      themeList: [],
      themeOptions: [],
      albumList: [],
      favorite: [],
      reviewingAlbum: {}, // count,data:[{src,pageIndex}],
      reviewIndex: 0,
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
      loading1: false
    };
  },

  components: {},

  computed: {
    service() {
      return this.$store.state.platform;
    },
    reviewingPage() {
      return this.reviewingAlbum[this.reviewIndex] || {};
    },
    uid() {
      return this.$store.state.uid;
    }
  },
  created() {
    this.init();
  },
  mounted() {
    console.log("this.$store.state.uid :>> ", this.$store.state.uid, this.uid);
    console.log("this.service :>> ", this.service);
    this.albumList = [
      {
        uid: 1,
        aid: 1,
        theme: "明月几时有",
        name: "秦时明月",
        cover_url: "http://localhost:7001/public/lg6.png",
        page_count: 33,
        create_at: new Date(),
        remark: "啊啊啊",
        popularity: 66
      },
      {
        uid: 1,
        aid: 1,
        theme: "明月几时有",
        name: "秦时明月",
        cover_url: "http://localhost:7001/public/yangtai.png",
        page_count: 33,
        create_at: new Date(),
        remark: "啊啊啊",
        popularity: 66
      }
    ];
  },

  methods: {
    goDIY() {
      this.$router.push("/diy");
    },
    // 初始化页面
    init() {
      this.getThemeList();
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
    // 搜索
    queryByName() {
      // todo
    },
    // 处理新建事件
    handleAddClick() {
      this.createDia = true;
    },
    // 创建相册
    createAlbum() {
      console.log("创建相册啦");
      this.loading1 = true;
      albumRequest.createAlbum(this.albumForm, this.uid).then(res => {
        this.loading1 = false;
        this.$router.push({
          name: "diy",
          params: { aid: res.data.aid }
        });
      });
    },
    // 添加收藏
    addToFavorite(aid) {},
    // 取消收藏
    popFromFavorite(aid) {},
    // 预览相册
    toReview(aid) {},
    // 以模板样式进入设计页面
    toDesign(aid) {},
    // 预览上一页
    toPastPage() {
      this.reviewIndex -= 1;
    },
    // 预览下一页
    toNextPage() {
      this.reviewIndex += 1;
    }
  }
};
</script>
<style lang="scss" scoped>
.head {
  background-color: rgb(238, 206, 211);
  padding: 10px;
  .tool {
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
    list-style-type: none;
    text-align: left;
    li {
      display: inline-block;
      margin: 5px 10px;
      cursor: pointer;
      border: 1px solid white;
      border-radius: 8px;
      padding: 5px;
      color: white;
      &:active,
      &:hover,
      &:focus {
        background-color: rgb(224, 160, 233);
      }
    }
  }
}
.album-list {
  padding: 10px;
  display: flex;
  justify-content: start;
  .cover-container {
    .cover-pic {
      width: 4.2rem;
      height: 6rem;
      cursor: pointer;
    }
  }
  .album {
    width: fit-content;
    padding: 5px;
    border: 1px solid #bab7b7;
    background-color: #d7ebfc;
    position: relative;
    margin: 10px;
    .row1 {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        font-size: 12px;
      }
      img {
        cursor: pointer;
        display: inline-block;
        width: 24px;
      }
    }
    .row2 {
      text-align: left;
      .theme-name {
        font-size: 8px;
        color: #494343ee;
      }
    }
    .review {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
}
.home >>> .dia-review {
  width: 56vh;
  height: 80vh;
  .review-pc {
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
@media screen and (max-width: 700px) {
  .head {
    text-align: left;
    font-size: 14px;
    .tool {
      .search {
        width: calc(100vw - 80px);
      }
    }
    .theme-list {
      padding: 0;
    }
  }
  .album-list {
    .album {
      .cover-pic {
        width: 35vw;
        height: 50vw;
      }
    }
  }
  .home >>> .dia-review {
    width: 100vw;
    height: 100vh;
  }
}
</style>
