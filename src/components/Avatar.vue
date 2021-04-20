<template>
  <el-dropdown @command="handleCommand">
    <img class="avatar" :src="src" />
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="mine">个人中心</el-dropdown-item>
      <el-dropdown-item command="toggleIdentity" v-if="identity === 'admin'"
        >切换身份</el-dropdown-item
      >
      <el-dropdown-item command="logout">登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  components: {},
  props: {
    src: String
  },
  data() {
    return {};
  },
  watch: {},
  computed: {
    identity() {
      console.log(
        "this.$store.state.user.identity :>> ",
        this.$store.state.user.identity
      );
      return this.$store.state.user.identity;
    }
  },
  created() {},
  mounted() {},
  methods: {
    // 处理头像下拉框事件
    // todo
    handleCommand(command) {
      switch (command) {
        case "mine":
          this.$router.push("/mine");
          break;
        case "toggleIdentity":
          if (this.$route.path.includes("/diy-manage")) {
            this.$router.push("/template");
          } else {
            this.$router.push("/diy-manage/home");
          }
          break;
        case "logout":
          this.$store.dispatch("LOGOUT");
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.avatar {
  vertical-align: middle;
  margin-left: 10px;
  width: 0.8rem;
  height: 0.8rem;
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
}
@media screen and (max-width: 768px) {
  .avatar {
    margin-left: 0;
    width: 30px;
    height: 30px;
  }
}
</style>
