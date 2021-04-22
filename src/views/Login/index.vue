<!--  -->
<template>
  <div class="login">
    <login
      :platform="platform"
      :tabList="tabList"
      ref="login"
      :loading="loading"
      @login="login"
      @sendvalidcode="sendValidCode"
    >
      <template v-slot:theme>
        <img class="diy-img" src="./icons/diy.png" alt="" />
        <span class="login-title">LOGIN</span>
      </template>
      <template v-slot:qrcode_tips>
        扫一扫二维码登陆更方便~
      </template>
    </login>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import Login from "@/components/Login";
import user from "@/api/user.js";
import Cookie from "@/utils/cookie.js";
export default {
  components: { Login },
  data() {
    return {
      service: "pc",
      tabList: [],
      errInfo: null,
      checkLogin: null,
      rules: {},
      loading: false
    };
  },

  computed: {
    platform() {
      let service = this.$store.state.platform;
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
        components: ["mobile", "validCode"]
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
  mounted() {
    // new QRCode(
    //   document.getElementById("qrcode"),
    //   "http://www.baidu.com"
    // );
    new QRCode("qrcode", {
      text: "http://www.baidu.com",
      width: 200,
      height: 200
    });
    // qrcode.makeCode("www.baidu.com");
    console.log("this.$refs.login :>> ", this.$refs.login);
  },
  methods: {
    // 登录
    login(form, ref) {
      //   if (params.account == "eachan" && params.password == "123456")
      //     this.$router.push("/");
      // console.log("form:", form);
      this.loading = true;
      user
        .login(form)
        .then(res => {
          this.$store.commit("SET_UID", res.data.userInfo.uid);
          this.$store.commit("SET_IDENTITY", res.data.userInfo.identity);
          this.$store.commit("SET_ISVIP", res.data.userInfo.isvip);
          Cookie.setToken(res.data.token);
          if (res.data.userInfo.identity === "admin") {
            this.$router.push("/identity-select");
          } else {
            this.$router.push("/template");
          }
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
          this.errInfo = err.data.message;
          this.$refs["login"].$refs[ref][0].validateField("account");
          this.errInfo = null;
          this.loading = false;
        });
    },
    // 发送验证码
    sendValidCode() {
      console.log("发送验证码");
    }
  }
};
</script>
<style lang="scss" scoped>
.login {
  width: 100vw;
  height: 100vh;
  /* background-image: linear-gradient(
    to top,
    #fdcbf1 0%,
    #fdcbf1 1%,
    #e6dee9 100%
  ); */
  /* transform: rotate(45deg); */
  background-image: url("./icons/prototype.png");
  /* background-size: 100px 100px; */
  animation: sheen 60s linear 0s infinite normal none running;
}
@keyframes sheen {
  0% {
    background-position: 0px 0px;
  }
  100% {
    background-position-x: 1661px;
    background-position-y: -1661px;
  }
}
.login-title {
  font-size: 27px;
}
.diy-img {
  display: inline-block;
  width: 64px;
  vertical-align: middle;
}
.login-title {
  font-size: 32px;
  vertical-align: text-top;
}
</style>
