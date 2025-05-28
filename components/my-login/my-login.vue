<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
    <text class="tips-text">登陆后尽享更多权益</text>
  </view>
</template>

<script>
  import {
    mapMutations,
    mapStates
  } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapStates('m_user', ['userInfo', 'token', 'redirectInfo']),
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 获取用户信息
      getUserInfo(e) {
        if (e.detail.errMsg === "getUserInfo:fail auth deny") return uni.$showMsg('您取消了登录授权')
        // 获取用户信息成功
        // console.log(e.detail.userInfo)
        this.updateUserInfo(e.detail.userInfo)
        this.getToken(e.detail)
      },
      // 获取token
      async getToken(info) {
        //获取code
        const [err, res] = await uni.login().catch(err => err)
        if (err || res.errMsg !== 'login:ok') return uni.$showMsg('获取登录凭证失败，请稍后再试')

        //准备参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature,
        }
        const {
          data: loginResult
        } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        if (loginResult.meta.status !== 200) return uni.$showMsg('登录失败')

        this.updateToken(loginResult.message.token)
        this.navigateBack()
      },
      // 返回上一级
      navigateBack() {
        // 如果有重定向信息，则跳转到指定页面
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.navigateTo({
            url: this.redirectInfo.from,
            complete: () => {
              this.updateRedirectInfo(null) // 清除重定向信息
            }
          })
        }
      },
    },
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translate(50%, );
    }

    .btn-login {
      width: 90%;
      border-radius: 75px;
      margin: 15px 0;
      background-color: #c00000;
    }

    .tips-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>