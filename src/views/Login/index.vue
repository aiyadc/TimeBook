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
      rules: {}
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
      text:'http://www.baidu.com',
      width: 200,
      height: 200,
    });
    // qrcode.makeCode("www.baidu.com");
    console.log("this.$refs.login :>> ", this.$refs.login);
  },
  methods: {
    login(form, ref) {
      //   if (params.account == "eachan" && params.password == "123456")
      //     this.$router.push("/");
      console.log("form:", form);
      user
        .login(form)
        .then(res => {
          console.log("res", res);
          this.$store.commit("SET_UID", res.data.userInfo.uid);
          console.log("res.data.token :>> ", res.data.token);
          Cookie.setToken(res.data.token);
          console.log("Cooke.setToken :>> ", Cookie.setToken);
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
          this.errInfo = err.data.message;
          this.$refs["login"].$refs[ref][0].validateField("account");
          this.errInfo = null;
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
