<!--  -->
<template>
  <div>
    <login @login="login" :platform="platform" :tabList="tabList">
      <template v-slot:theme>
        <span class="login-title">登录</span>
      </template>
    </login>
  </div>
</template>

<script>
import Login from "@/components/Login";
export default {
  components: { Login },
  data() {
    return {
      service: "pc",
      tabList: []
    };
  },

  computed: {
    platform() {
      let service = this.$store.state.plateform;
      this.service = service;
      console.log("service:", this.service);
      return service;
    }
  },
  watch: {
    platform(val) {
      location.reload();
    }
  },
  created() {
    this.tabList = [
      {
        tab: "account_login",
        label: "账号登录",
        components: [ "account", "password"]
      },
      {
        tab: "phone_login",
        label: "手机号登录",
        components: ["account", "validCode"]
      }
    ];
  },

  methods: {
    login(form) {
    //   if (params.account == "eachan" && params.password == "123456")
    //     this.$router.push("/");
        console.log(form)
    }
  }
};
</script>
<style lang="scss" scoped>
.login-title {
  font-size: 27px;
}
</style>
