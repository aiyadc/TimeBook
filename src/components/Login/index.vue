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
          <slot name="theme" v-if="!isQrcode">
          </slot>
        </div>
      </div>
      <div id="boxmain">
        <el-tabs
          class="psw-login"
          v-model="activeTab"
          @tab-click="handleTabClick"
          v-show="!isQrcode"
        >
          <el-tab-pane
            v-for="tab in tabs"
            :label="tab.label"
            :name="tab.name"
            :key="tab.name"
          >
            <el-form
              :model="lgParams"
              :rules="rules"
              :ref="'loginForm' + tab.name"
            >
              <el-form-item
                label=""
                v-if="!!tab.components.account"
                prop="account"
              >
                <el-input
                  v-model="lgParams.account"
                  :placeholder="tab.components.account.placeholder"
                  prefix-icon="el-icon-user"
                >
                </el-input>
              </el-form-item>

              <el-form-item
                label=""
                v-if="!!tab.components.password"
                prop="password"
              >
                <el-input
                  type="password"
                  v-model="lgParams.password"
                  :placeholder="tab.components.password.placeholder"
                  prefix-icon="el-icon-lock"
                ></el-input>
              </el-form-item>
              <el-form-item
                label=""
                v-if="!!tab.components.artcode"
                prop="checkCode"
              >
                <el-input
                  v-model="lgParams.checkCode"
                  :placeholder="tab.components.artcode.placeholder"
                  prefix-icon="el-icon-s-claim"
                ></el-input>
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
                    style="float: left; margin: 10px 5px"
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
          <slot name="qrcode_tips" v-if="isQrcode">
          </slot>
          <!--放置二维码-->
          <div id="qrcode" v-loading="codeLoginLoading" element-loading-text="登录中，请稍后">
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
      title="注册"
      :visible.sync="registerVisible"
      :before-close="beforeCloseRT"
    >
      <div>
        <slot name="register"><h1>这是注册面板</h1></slot>
      </div>
    </el-dialog>
    <!--找回密码弹框-->
    <el-dialog
      title="重置密码"
      :visible.sync="resetPswVisible"
      :before-close="beforeCloseRS"
    >
      <div>
        <slot name="resetPsw"><h1>这是找回密码面板</h1></slot>
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
 * @event login 点击登录触发，带表单参数
 * @event storeme 点击记住我触发
 **/
export default {
  name: "mulLogin",
  props: {
    boxStyle: Object,
    // 功能物件集合如['记住我','忘记密码','其他登录方式','二维码登录','重置密码（未设计）'，'注册（未设计）']
    features: {
      type: Array,
      default: () => ["rememberMe", "forgetPsw", "qrcode", "register"],
    },
    // 登录器最下面的内容，如文字，可自定义
    footText: {
      type: String,
      default:
        '<span style="text-align:center; font-size:8px;">如登录、注册遇到问题，请联系客服</span>',
    },
    // 优先展示的登录方式
    firstMode:{
      type: String,
      default: 'accountLogin'
    },
    // 登录按钮loading效果：
    loading: {
      type: Boolean,
      default: false,
    },
    // 二维码扫描loading效果
    codeLoginLoading:{
      type:Boolean,
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
              trigger: "blur",
            },
          ],
          password: {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
          },
          checkCode: {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
          },
        };
      },
    },
    // 面板和表单内容
    tabs: {
      type: Array,
      default: () => {
        return [
          {
            label: "账号登录",
            name: "account",
            components: {
              account: {
                placeholder: "请输入您的账号",
              },
              password: {
                placeholder: "请输入您的密码",
              },
            },
          },
          // {
          //   label: "手机号登录",
          //   name: "phone",
          //   components: {
          //     account: {
          //       label: "手机号",
          //       placeholder: "请输入您的手机号",
          //     },
          //     artcode: {
          //       label: "",
          //       placeholder: "请输入验证码",
          //     },
          //   },
          // },
        ];
      },
    },
  },
  data() {
    return {
      // 当前的登录模式
      isQrcode: false,
      // 当前激活的面板
      activeTab: "account",
      // 表单参数
      lgParams: {
        account: "",
        password: "",
        checkCode: "", // 表单验证码
      },
      // 是否记住本次登录信息
      ifRememberMe: false,
      // 对话框是否可见
      registerVisible: false,
      resetPswVisible: false,
    };
  },
  methods: {
    // 切换面板
    handleTabClick(tab, event) {
      // this.$refs['formField'].resetFields()
      console.log(
        tab.name,
        this.$refs["loginForm" + tab.name][0].resetFields()
      );
      this.$emit("clicktab", tab, event);
    },
    // 点击登录
    handleLogin() {
      let ref = "loginForm" + this.activeTab;
      this.$refs[ref][0].validate((valid) => {
        if (valid) {
          this.$emit("login", this.lgParams, ref);
          if (this.features.indexOf("rememberMe")) {
            this.$emit("storeme", this.ifRememberMe, this.lgParams);
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
  },
  mounted() {
    this.isQrcode = this.firstMode == 'accountLogin'? false:true
  },
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
    .psw-login {
      margin: 45px 20px 0;
    }
    .code-login {
      margin: 0 20px;
      min-height: 300px;
      #qrcode {
        text-align: center;
        width: 100%;
        max-height: 250px;
      }
      .under-code {
        text-align: center;
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
.fit-btn {
  display: block;
  width: 100%;
  margin: 20px 0 0;
}
</style>

