<!--  -->
<template>
  <div>
    <login
      @login="login"
      :platform="platform"
      :tabList="tabList"
      :rules="rules"
      ref="login"
    >
      <template v-slot:theme>
        <span class="login-title">登录</span>
      </template>
    </login>
  </div>
</template>

<script>
import Login from "@/components/Login";
import user from "@/api/user.js";
export default {
  components: { Login },
  data() {
    return {
      service: "pc",
      tabList: [],
      errInfo: null,
      checkLogin: null,
      rules: {}
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
    console.log("process", process);
    this.tabList = [
      {
        tab: "account_login",
        label: "账号登录",
        components: ["account", "password"]
      },
      {
        tab: "phone_login",
        label: "手机号登录",
        components: ["account", "validCode"]
      }
    ];
    const checkLogin = (rule, value, callback) => {
      if (this.errInfo) {
        console.log(this.errInfo);
        callback(this.errInfo);
      }
      callback();
    };
    this.rules = {
      account: [
        {
          required: true,
          message: "账号不能为空噢",
          trigger: "blur"
        },
        { validator: checkLogin, trigger: "blur" }
      ],
      password: {
        required: true,
        message: "密码不能为空",
        trigger: "blur"
      }
    };
  },

  methods: {
    login(form, ref) {
      //   if (params.account == "eachan" && params.password == "123456")
      //     this.$router.push("/");
      console.log('form:', form);
      user
        .login(form)
        .then(res => {
          console.log("res", res);
          this.$router.push("/");
        })
        .catch(err => {
          // console.log(err)
          this.errInfo = err.data.message;
          this.$refs["login"].$refs[ref][0].validateField("account");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.login-title {
  font-size: 27px;
}
</style>
