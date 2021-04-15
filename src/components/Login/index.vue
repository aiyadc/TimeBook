<template>
  <div id="mulLogin">
    <div id="lgBox" :style="boxStyle">
      <div class="loginmode" v-if="features.indexOf('qrcode') !== -1">
        <a
          ><img src="./images/lg-psw.png" v-show="isQrcode" @click="changeMode"
        /></a>
        <a
          ><img
            src="./images/lg-qrcode.png"
            v-show="!isQrcode"
            @click="changeMode"
        /></a>
      </div>
      <div id="boxhead">
        <div class="theme">
          <slot name="theme" v-if="!isQrcode"> </slot>
        </div>
      </div>
      <div id="boxmain">
        <el-tabs
          class="tabs"
          v-model="activeTab"
          @tab-click="handleTabClick"
          v-show="!isQrcode"
        >
          <el-tab-pane
            v-for="tab in tabList"
            :label="tab.label"
            :name="tab.tab"
            :key="tab.tab"
          >
            <el-form :model="lgParams" :rules="rules" :ref="tab.tab">
              <el-form-item
                prop="dientity"
                v-if="tab.components.indexOf('identity') !== -1"
              >
                <el-select
                  v-model="lgParams.identity"
                  :placeholder="formOptions.identity.placeholder"
                >
                  <img class="icon" slot="prefix" src="./images/identity.png" />
                  <el-option
                    v-for="(u, i) in formOptions.identity.options"
                    :key="i"
                    :label="u.lable"
                    value="u.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                prop="account"
                v-if="tab.components.indexOf('account') !== -1"
              >
                <el-input
                  v-model="lgParams.account"
                  :placeholder="formOptions.account.placeholder"
                  prefix-icon="el-icon-user"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                prop="mobile"
                v-if="tab.components.indexOf('mobile') !== -1"
                :rules="[{ validator: validateMobile, trigger: 'blur' }]"
              >
                <el-input
                  v-model="lgParams.mobile"
                  type="tel"
                  :placeholder="formOptions.mobile.placeholder"
                  prefix-icon="el-icon-mobile-phone"
                >
                </el-input>
              </el-form-item>
              <el-form-item
                prop="password"
                v-if="tab.components.indexOf('password') !== -1"
              >
                <el-input
                  type="password"
                  v-model="lgParams.password"
                  :placeholder="formOptions.password.placeholder"
                  prefix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>
              <el-form-item
                v-if="tab.components.indexOf('validCode') !== -1"
                prop="validCode"
              >
                <el-input
                  v-model="lgParams.validCode"
                  :placeholder="formOptions.validCode.placeholder"
                  prefix-icon="el-icon-s-claim"
                >
                  <a
                    :class="{ 'suffix-text': true, active: timeout === 0 }"
                    :href="void 0"
                    slot="suffix"
                    @click="sentValidCode(tab.tab)"
                    >{{
                      timeout === 0 ? "获取验证码" : timeout + "s 后可重发"
                    }}</a
                  >
                </el-input>
                <!-- <el-button type="primary">发送验证码</el-button> -->
              </el-form-item>
              <div>
                <div v-loading="loading">
                  <el-button @click="handleLogin" class="fit-btn" type="danger"
                    >登录</el-button
                  >
                </div>
                <div class="about-login">
                  <el-checkbox
                    v-model="ifRememberMe"
                    style="float: left; margin: 10px 5px;"
                    v-if="features.indexOf('rememberMe') !== -1"
                    >记住我</el-checkbox
                  >
                  <el-button
                    type="text"
                    style="float: right; color: #000000"
                    @click="handleForgetPsw"
                    v-if="features.indexOf('forgetPsw') !== -1"
                    >忘记密码</el-button
                  >
                  <el-button
                    type="text"
                    style="color: #000000; float: right; margin-right: 10px"
                    @click="handleRegister"
                    v-if="features.indexOf('register') !== -1"
                    >注册</el-button
                  >
                </div>
              </div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div class="code-login" v-show="isQrcode">
          <div class="qrcode-tips">
            <slot name="qrcode_tips" v-if="isQrcode"> </slot>
          </div>
          <!--放置二维码-->
          <div
            id="qrcode"
            v-loading="codeLoginLoading"
            element-loading-text="登录中，请稍后"
          >
            <slot name="qrcode"> </slot>
          </div>
          <div class="under-code">
            <!--二维码下面的相关描述-->
            <slot name="underCode"> </slot>
          </div>
        </div>
        <div
          class="otherway"
          v-show="!isQrcode && features.indexOf('otherway') !== -1"
        >
          <span>其他登陆方式</span>
          <div>
            <slot name="otherway"> </slot>
          </div>
        </div>
      </div>
      <div class="footer">
        <div v-html="footText"></div>
      </div>
    </div>
    <!--注册弹框-->
    <el-dialog
      custom-class="register"
      title="注册"
      :visible.sync="registerVisible"
      :before-close="beforeCloseRT"
    >
      <div>
        <slot name="register">注册功能暂未开通</slot>
      </div>
    </el-dialog>
    <!--找回密码弹框-->
    <el-dialog
      custom-class="reset-password"
      title="重置密码"
      :visible.sync="resetPswVisible"
      :before-close="beforeCloseRS"
    >
      <div>
        <slot name="resetPsw">找回密码功能暂未开通</slot>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**参数说明
 * @author eachan.Lin
 * @slot theme 容器主题，在form的上方
 * @slot qrcode 放置二维码的容器
 * @slot underCode 在二维码下边的内容
 * @slot qrcode_tips 二维码上方的提示
 * @event clicktab 切换登录方式的时候触发
 * @event login 点击登录触发，带表单参数
 * @event storeme 点击记住我触发
 * @event sendvalidcode 点击发送验证码触发
 **/
export default {
  name: "mulLogin",
  props: {
    // 平台 pc/h5
    platform: String,
    boxStyle: Object,
    // 功能物件集合如['记住我','忘记密码','其他登录方式','二维码登录','重置密码（未设计）'，'注册（未设计）']
    features: {
      type: Array,
      default: () => ["rememberMe", "forgetPsw", "qrcode", "register"]
    },
    // 登录器最下面的内容，如文字，可自定义
    footText: {
      type: String,
      default:
        '<span style="text-align:center; font-size:12px;">如登录、注册遇到问题，请联系客服</span>'
    },
    // 优先展示的登录方式
    firstMode: {
      type: String,
      default: "accountLogin"
    },
    // 登录按钮loading效果：
    loading: {
      type: Boolean,
      default: false
    },
    // 二维码扫描loading效果
    codeLoginLoading: {
      type: Boolean,
      default: false
    },
    // 表单校验规则
    rules: {
      type: Object,
      default: () => {
        return {
          account: [
            { required: true, message: "账号不能为空", trigger: "blur" },
            {
              type: "number" && "string",
              message: "请输入正确格式的账号",
              trigger: "blur"
            }
          ],
          mobile: [
            { required: true, message: "手机号不能为空", trigger: "blur" }
          ],
          password: {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          },
          validCode: {
            required: true,
            message: "验证码不能为空",
            trigger: "blur"
          }
        };
      }
    },
    // 错误信息
    errInfo: { type: String, default: null },
    // 面板和表单内容
    tabList: {
      type: Array,
      default: () => {
        return [
          {
            tab: "account_login",
            label: "账号登录",
            components: ["identity", "account", "password", "validCode"]
          },
          {
            tab: "phone_login",
            label: "手机号登录",
            components: ["account", "validCode"]
          }
        ];
      }
    },
    formOptions: {
      type: Object,
      default: () => {
        return {
          identity: {
            label: "身份：",
            placeholder: "请选择您的身份",
            options: []
          },
          account: {
            label: "账号：",
            placeholder: "请输入账号"
          },
          mobile: {
            label: "手机号：",
            placeholder: "请输入手机号"
          },
          password: {
            label: "密码：",
            placeholder: "请输入密码"
          },
          validCode: {
            label: "验证码：",
            placeholder: "请输入验证码"
          }
        };
      }
    }
  },
  data() {
    return {
      // 使用平台
      service: "pc",
      // 当前的登录模式
      isQrcode: false,
      // 当前激活的面板
      activeTab: "account_login",
      // 表单参数
      lgParams: {
        identity: "",
        account: "",
        mobile: "",
        password: "",
        validCode: "" // 表单验证码
      },
      // 是否记住本次登录信息
      ifRememberMe: true,
      // 对话框是否可见
      registerVisible: false,
      resetPswVisible: false,
      timeout: 0 // 发送验证码计时器
    };
  },
  created() {
    this.getFormInfo();
  },
  watch: {
    platform: {
      handler(val) {
        this.service = val;
        console.log("login", val, this.service);
      },
      immediate: true
    }
  },
  methods: {
    // 切换面板
    handleTabClick(tab, event) {
      console.log(this.$refs[this.activeTab][0]);
      this.$refs[this.activeTab][0].resetFields();
      this.$emit("clicktab", tab, event);
      if (typeof Storage !== "undefined") {
        this.getFormInfo();
      }
    },
    // 获取localStorage中的表单信息
    getFormInfo() {
      // 获取当前tab下的表单项存在localstorage的值，将它填入表单中
      const curTab = this.tabList.find(tab => tab.tab == this.activeTab);
      const components = curTab.components;
      components.forEach(comp => {
        this.lgParams[comp] = localStorage.getItem(comp);
      });
    },
    // 点击登录
    handleLogin() {
      let ref = this.activeTab;
      this.$refs[ref][0].validate(valid => {
        if (valid) {
          let form = {};
          let activeComponent = this.tabList.find(tab => {
            return tab.tab === this.activeTab;
          }).components;
          for (let i in activeComponent) {
            // 过滤表单项
            // 这里由于tab中component名字和表单内的属性名相同,所以直接匹配
            form[activeComponent[i]] = this.lgParams[activeComponent[i]];
          }
          this.$emit("login", form, ref);
          console.log(
            "---------------- :>> ",
            this.features.indexOf("rememberMe"),
            this.ifRememberMe
          );
          if (this.features.indexOf("rememberMe") !== -1) {
            // 存储表单项
            if (typeof Storage !== "undefined") {
              if (this.ifRememberMe) {
                console.log("存储到localstorage");
                for (let i in form) {
                  localStorage.setItem(i, form[i]);
                }
              } else {
                for (let i in form) {
                  localStorage.removeItem(i);
                }
              }
            }
            // this.$emit("storeme", this.ifRememberMe, form);
          }
        } else {
          console.log("error summit");
          return false;
        }
      });
    },
    // 登录模式改变
    changeMode() {
      this.isQrcode = !this.isQrcode;
      // 如果切换到二维码登录，则触发一个二维码登录事件,反之触发一个账号密码登录事件
      if (this.isQrcode) this.$emit("qrcode-login");
      else this.$emit("account-login");
    },
    // 发送验证码
    sentValidCode(ref) {
      console.log("ref :>> ", this.$refs[ref]);
      if (this.timeout != 0) return;
      else {
        const valid = this.$refs[ref][0].validateField("mobile", err => {
          if (!err) {
            this.$emit("sendvalidcode");
            this.timeout = 59;
            let timer = setInterval(() => {
              this.timeout -= 1;
              if (this.timeout == 0) clearInterval(timer);
            }, 1000);
          }
        });
        // // 触发验证码发送事件
      }
    },
    // 注册
    handleRegister() {
      console.log("注册");
      this.registerVisible = true;
    },
    // 记住我
    storeMe() {
      this.$emit("storeme", this.ifRememberMe);
    },
    // 忘记密码
    handleForgetPsw() {
      this.resetPswVisible = true;
    },
    // 关闭对话框回调
    beforeCloseRT() {
      this.registerVisible = false;
    },
    beforeCloseRS() {
      this.resetPswVisible = false;
    },
    // 验证手机号
    validateMobile(rule, value, callback) {
      if (!value) {
        console.log("no value");
        callback(new Error("请先填写手机号"));
      } else if (!this.validatePhone(value)) {
        console.log("aaa");
        callback(new Error("请填写正确格式的手机号"));
      } else {
        callback();
      }
    },
    // 验证手机号格式
    validatePhone(str) {
      str = str + "";
      const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
      return reg.test(str);
    }
  },
  mounted() {
    this.isQrcode = this.firstMode == "accountLogin" ? false : true;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
* {
  box-sizing: border-box;
  user-select: none;
}
#mulLogin {
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
#lgBox {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  min-height: 400px;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px 0 rgba(0, 33, 79, 0.11);
  border-radius: 6px;
  @media screen and (max-width: 600px) {
    width: 100vw;
    height: 100vh;
  }
  .suffix-text {
    display: inline-block;
    width: 100px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    cursor: default;
    color: #c5c5c5;
  }
  .active {
    color: #3d84ff;
    cursor: pointer;
    &:active,
    &:hover {
      text-decoration: underline;
    }
  }
  .loginmode {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  #boxhead {
    text-align: center;
    width: 100%;
    height: auto;
    max-height: 20%; // XXX:待确定
    .theme {
      margin-top: 30px;
      box-sizing: border-box;
      height: 30px;
    }
  }
  #boxmain {
    .tabs {
      margin: 45px 20px 0;
      text-align: left;
    }
    .code-login {
      margin: 0 20px;
      min-height: 300px;
      position: relative;
      #qrcode {
        position: absolute;
        left: 50%;
        top: 60%;
        transform: translate(-50%, -60%);
        text-align: center;
        // width: 100%;
        max-height: 250px;
      }
      .under-code {
        text-align: center;
      }
      @media screen and (max-width: 768px) {
        border: 1px solid #eee;
      }
    }
    .about-login {
      // display: flex;
      // justify-content: space-around;
    }
    .otherway {
      height: 9px;
      margin: 20px;
      border-bottom: 1px solid #ededed;
      text-align: center;
      span {
        margin: -9px;
        line-height: 18px;
      }
    }
  }
  .footer {
    text-align: center;
    margin: 30px 0 10px;
  }
}
>>> .register {
  height: 400px;
  margin: auto;
  @media screen and (max-width: 768px) {
    margin-top: 0;
    width: 90vw;
    height: 60vh;
  }
}
>>> .reset-password {
  height: 400px;
  margin: auto;
  @media screen and (max-width: 768px) {
    margin-top: 0;
    width: 90vw;
    height: 60vh;
  }
}
.fit-btn {
  display: block;
  width: 100%;
  margin: 20px 0 0;
}
.icon {
  width: 14px;
  height: 14px;
  margin-left: 7px;
  vertical-align: middle;
}
</style>
