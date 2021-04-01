<!-- Home -->
<template>
  <div class="home">
    <div class="head">
      <div class="tool">
        <el-input
          class="search"
          v-model="search"
          placeholder="请输入关键字进行搜索"
        ></el-input>
        <el-button
          class="create"
          :type="service == 'h5' ? 'text' : 'primary'"
          icon="el-icon-plus"
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
    <el-dialog title="创建">
      <el-form :model="albumForm">
        <el-form-item label="相册名称">
          <el-input
            v-model="albumForm.name"
            placeholder="为你的相册取一个好听的名称吧~"
          ></el-input>
        </el-form-item>
        <el-form-item label="主题">
          <el-select v-model="albumForm.theme" placeholder="与相册相关的主题">
            <el-option v-for="(t, i) in themeOptions" :key="i"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-button type="primary" plain @click="goDIY">设计</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      themeList: [],
      albumList: [],
      favorite: [],
      reviewingAlbum: {}, // count,data:[{src,pageIndex}],
      reviewIndex: 0,
      reviewDia: false,
      albumForm: {
        name: "",
        theme: ""
      },
      themeOptions: []
    };
  },

  components: {},

  computed: {
    service() {
      return this.$store.state.platform;
    },
    reviewingPage() {
      return this.reviewingAlbum[this.reviewIndex] || {};
    }
  },

  mounted() {
    console.log("this.service :>> ", this.service);
    this.themeList = [
      {
        tid: 0,
        name: "全部",
        count: 300
      },
      {
        tid: 1,
        name: "宝贝/亲子",
        count: 100
      },
      {
        tid: 2,
        name: "恋爱/写真",
        count: 100
      },
      {
        tid: 3,
        name: "青春/校园",
        count: 70
      },
      {
        tid: 4,
        name: "风景/自然",
        count: 30
      }
    ];
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
    init() {},
    // 获取主题列表:
    getThemeList() {},
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
