<!-- layout -->
<template>
  <div>
    <div class="layout">
      <div class="menu-container">
        <el-menu
          class="catalog"
          :default-active="curTab"
          :collapse="isCollapse"
          :router="true"
          @select="handleSelect"
          @close="handleClose"
        >
          <template v-for="tab in tabList">
            <el-submenu :index="tab.name" :key="tab.name" v-if="tab.children">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span slot="title">{{ tab.label }}</span>
              </template>
              <el-menu-item
                v-for="tabChild in tab.children"
                :key="tabChild.name"
                :index="tabChild.name"
              >
                <i :class="tabChild.icon"></i>
                <span>{{ tabChild.label }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="tab.name" :key="tab.name" v-else>
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
            </el-menu-item>
          </template>
        </el-menu>
      </div>
      <div class="main">
        <!-- 右侧头部部分 -->
        <div class="header">
          <div>
            <img
              class="sidebar-icon"
              src="./images/sidebar-left.svg"
              @click="isCollapse = true"
              v-if="!isCollapse"
            />
            <img
              class="sidebar-icon"
              src="./images/sidebar-right.svg"
              @click="isCollapse = false"
              v-else
            />
            <span class="title">{{ getCurrentTab() }}</span>
          </div>
          <avatar :src="avatar_url"></avatar>
        </div>
        <!-- 右侧内容部分，对接各子页面 -->
        <div class="content">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from "@/components/Avatar.vue";
export default {
  components: {
    Avatar
  },

  data() {
    return {
      curTab: "/diy-manage/home",
      indexPath: ["/diy-manage/home"],
      tabList: [],
      isCollapse: false
    };
  },
  watch: {
    $route(val) {
      this.rerender();
    }
  },
  computed: {
    avatar_url() {
      return this.$store.state.user.avatar_url;
    }
  },
  created() {
    this.tabList = [
      {
        icon: "el-icon-house",
        name: "/diy-manage/home",
        label: "HOME"
      },
      {
        icon: "el-icon-user",
        name: "/diy-manage/user",
        label: "用户"
      },
      {
        icon: "el-icon-camera",
        name: "/diy-manage/template",
        label: "模板"
      },
      {
        icon: "el-icon-star-off",
        name: "/diy-manage/decoration",
        label: "装饰",
        children: [
          {
            icon: "el-icon-picture-outline",
            name: "/diy-manage/decoration/material",
            label: "素材"
          },
          {
            icon: "el-icon-folder",
            name: "/diy-manage/decoration/sort",
            label: "目录"
          }
        ]
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/sentence",
        label: "文案",
        children: [
          {
            icon: "el-icon-reading",
            name: "/diy-manage/sentence/material",
            label: "素材"
          },
          {
            icon: "el-icon-folder",
            name: "/diy-manage/sentence/sort",
            label: "目录"
          }
        ]
      },
      {
        icon: "el-icon-magic-stick",
        name: "/diy-manage/theme",
        label: "主题"
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/font",
        label: "字体"
      }
    ];
    this.rerender();
  },
  mounted() {},
  methods: {
    // 处理子菜单打开事件
    handleSelect(index, indexPath) {
      // todo
      console.log("index,indexPath :>> ", index, indexPath);
      this.curTab = index;
      this.indexPath = indexPath;
    },
    // 处理菜单关闭事件
    handleClose(index, indexPath) {
      // todo
      console.log("index,indexPath :>> ", index, indexPath);
    },
    // 获取当前点击的tab的名字
    getCurrentTab() {
      let tabName = "";
      this.indexPath.reduce((pre, cur) => {
        if (pre.children) {
          let tab = pre.children.find(tab => tab.name == cur);
          tabName += " / " + tab.label;
          return tab;
        } else {
          let tab = this.tabList.find(tab => tab.name == cur);
          tabName += tab.label;
          return tab;
        }
      }, {});
      //   let tab = this.tabList.find(tab => tab.name == this.curTab);
      //   let label = tab && tab.label;
      return tabName;
    },
    // 处理导航栏缩放
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 处理头像下拉项点击事件
    handleCommand(command) {
      console.log("command :>> ", command);
      switch (command) {
        case "homepage":
          this.$router.push("/mine");
          break;
        case "toggleIdentity":
          this.$router.push("/template");
          break;
        case "logout":
          this.$store.dispatch("LOGOUT");
      }
    },
    rerender() {
      let pathOptions = this.$route.path.split("/");
      let path = pathOptions.join("/");
      this.curTab = path;
      this.indexPath = [path];
      if (pathOptions.length > 3) {
        let path1 = pathOptions.slice(0, pathOptions.length - 1).join("/");
        this.indexPath = [path1, path];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.layout {
  width: 100vw;
  text-align: left;
  display: flex;
  .menu-container {
    .catalog:not(.el-menu--collapse) {
      width: 200px;
      height: 100vh;
    }
  }

  .main {
    flex: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      background-color: #b2d5f3;
      height: 1rem;
      min-height: 50px;
      text-align: right;
      .title {
        vertical-align: middle;
      }
      .sidebar-icon {
        display: inline-block;
        width: 24px;
        margin-right: 10px;
        vertical-align: middle;
      }
    }
    .content {
      flex: 1;
    }
  }
}
</style>
