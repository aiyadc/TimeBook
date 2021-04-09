<!-- layout -->
<template>
  <div>
    <el-row class="layout">
      <el-col class="nav" :span="4">
        <el-menu
          :default-active="curTab"
          class="el-menu-vertical-demo"
          @select="handleSelect"
          @close="handleClose"
        >
          <el-menu-item
            v-for="tab in tabList"
            :index="tab.name"
            :key="tab.name"
            >{{ tab.label }}</el-menu-item
          >
        </el-menu>
      </el-col>
      <el-col class="main" :span="20">
        <div class="header">
          <div>
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
        <el-row class="content">
          <router-view />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {
      curTab: "user",
      tabList: []
    };
  },

  computed: {},

  mounted() {
    this.tabList = [
      {
        name: "user",
        label: "用户管理"
      },
      {
        name: "template",
        label: "模板管理"
      },
      {
        name: "decoration",
        label: "装饰管理"
      },
      {
        name: "sentence",
        label: "文案管理"
      },
      {
        name: "theme",
        label: "主题管理"
      },
      {
        name: "font",
        label: "字体管理"
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
      console.log("tab :>> ", tab);
      return label;
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
  .nav {
    ul {
      height: 100vh;
    }
  }
  .main {
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
      background-color: #eeee;
    }
  }
}
</style>
