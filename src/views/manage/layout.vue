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
                <span slot="title">{{tab.label}}</span>
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
            <i class="el-icon-menu" @click="handleCollapse"></i>
            <span>{{ getCurrentTab() }}</span>
          </div>
          <div>
            <el-dropdown @command="handleCommand">
              <img class="avatar" src="@/assets/cc.jpg" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="homepage">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout">登出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
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
export default {
  components: {},

  data() {
    return {
      curTab: "/diy-manage/home",
      tabList: [],
      isCollapse: false
    };
  },

  computed: {},

  mounted() {
    this.tabList = [
      {
        icon: "el-icon-house",
        name: "/diy-manage/home",
        label: "HOME"
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/user",
        label: "用户"
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/template",
        label: "模板"
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/decoration",
        label: "装饰",
        children: [
          {
            icon: "el-icon-apple",
            name: "/diy-manage/decoration/material",
            label: "素材"
          },
          {
            icon: "el-icon-apple",
            name: "/diy-manage/decoration/sort",
            label: "分类"
          }
        ]
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/sentence",
        label: "文案",
        children: [
          {
            icon: "el-icon-apple",
            name: "/diy-manage/sentence/material",
            label: "素材"
          },
          {
            icon: "el-icon-apple",
            name: "/diy-manage/sentence/sort",
            label: "分类"
          }
        ]
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/theme",
        label: "主题"
      },
      {
        icon: "el-icon-apple",
        name: "/diy-manage/font",
        label: "字体"
      }
    ];
  },

  methods: {
    // 处理子菜单打开事件
    handleSelect(index, indexPath) {
      // todo
      //   console.log("index,indexPath :>> ", index, indexPath);
      this.curTab = index;
    },
    // 处理菜单关闭事件
    handleClose(index, indexPath) {
      // todo
      console.log("index,indexPath :>> ", index, indexPath);
    },
    // 获取当前点击的tab的名字
    getCurrentTab() {
      let tab = this.tabList.find(tab => tab.name == this.curTab);
      let label = tab && tab.label;
      return label;
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
          this.$router.push("mine");
          break;
        case "logout":
          this.$store.dispatch("LOGOUT");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100vw;
  .menu-container {
    .catalog:not(.el-menu--collapse) {
      width: 15vw;
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
      .avatar {
        vertical-align: middle;
        margin-left: 10px;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
      }
    }
    .content {
      flex: 1;
    }
  }
}
</style>
