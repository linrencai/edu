<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">管理员登录</h3>
      </div>

      <el-form-item prop="admAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="admAccount"
          v-model="loginForm.admAccount"
          placeholder="账号"
          name="admAccount"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="admPassword">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="admPassword"
          v-model="loginForm.admPassword"
          :type="passwordType"
          placeholder="密码"
          name="admPassword"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-form-item prop="verificationCode">
        <span class="svg-container">
          <i class="el-icon-message" />
        </span>
        <el-input
          ref="verificationCode"
          v-model="loginForm.verificationCode"
          placeholder="验证码"
          name="verificationCode"
          type="text"
          tabindex="3"
          auto-complete="on"
          style="width:65%;"
          @keyup.enter.native="handleLogin"
        />
        <img :src="url" alt="点击更换" class="yzm" @click="getCode" />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >登录</el-button>

      <div class="tips">
        <span style="margin-right:20px;">账号: admin</span>
        <span>密码: 123456</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
export default {
  name: "Login",
  data() {
    const validateAdmAccount = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error("Please enter the correct user name"));
      } else {
        callback();
      }
    };
    const validateAdmPassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("The password can not be less than 6 digits"));
      } else {
        callback();
      }
    };
    const validateVerificationCode = (rule, value, callback) => {
      if (value.length < 4 || value.length > 4) {
        callback(new Error("The verificationCode error"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        admAccount: "admin",
        admPassword: "123456",
        verificationCode: "1234"
      },
      loginRules: {
        admAccount: [
          { required: true, trigger: "blur", validator: validateAdmAccount }
        ],
        admPassword: [
          { required: true, trigger: "blur", validator: validateAdmPassword }
        ],
        verificationCode: [
          {
            required: true,
            trigger: "blur",
            validator: validateVerificationCode
          }
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      url: "http://127.0.0.1:8080/verificationCode/getCode"
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  // created() {
  //   this.getCode();
  // },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.admPassword.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("admin/adminLogin", this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || "/" });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getCode() {
      console.log('点击了yzm')
      this.url = "http://127.0.0.1:8080/verificationCode/getCode";
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .yzm {
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    padding: 10px 0px 6px 0;
    position: absolute;
  }
}
</style>
