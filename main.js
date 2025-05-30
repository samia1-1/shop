// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

import {
  $http
} from '@escook/request-miniprogram'

uni.$http = $http;

// 请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...',
  });

  // 判断请求的类型
  if (options.url.indexOf('/my/') !== -1) {
    // 如果是以/my/开头的请求，则需要携带token
    options.header = {
      Authorization: store.state.m_user.token || ''
    };
  }
};

$http.afterRequest = function() {
    uni.hideLoading()
  },

  //封装弹窗的方法
  uni.$showMsg = function(title = "数据请求失败", duration = 1500) {
    uni.showToast({
      title,
      duration,
      icon: 'none'
    })
  }

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif