<!-- 身份选择页面 -->
<template>
  <div class="identity-select">
    <div class="info">
      <span>相册DIY系统</span>
      <hr />
      <span>您可有如下身份访问本系统，请选择</span><br />
      <el-button class="long-btn" type="primary" @click="toHome('admin')"
        >管理员</el-button
      >
      <el-button class="long-btn" type="primary" @click="toHome('user')"
        >用户</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},

  data() {
    return {};
  },

  computed: {
    identity() {
      return this.$store.state.user.identity;
    }
  },

  mounted() {
    console.log('this.identity :>> ', this.identity);
  },

  methods: {
    // 切换身份
    toHome(identity) {
      if (identity === "admin") {
        this.$router.replace("/diy-manage/home");
      } else {
        this.$router.replace("/template");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.identity-select {
  width: 100%;
  height: 100%;
  position: relative;
  .info {
    width: 368px;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -40%);
    .long-btn {
      margin: 5px;
      width: 100%;
    }
  }
}
@media screen and (max-width: 768px) {
  .dientity-select {
    .info {
      width: 100vw;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>
