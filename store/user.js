export default {
  namespaced: true,

  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
    token: uni.getStorageSync('token' || ''),
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    redirectInfo: null,
  }),

  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    // 持久化address
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
    // 更新token
    updateUserInfo(state, userinfo) {
      state.userInfo = userinfo;
      this.commit('m_user/saveUserInfoToStorage')
    },
    // 持久化userInfo
    saveUserInfoToStorage(state) {
      uni.setStorageSync('userInfo', JSON.stringify(state.userInfo))
    },
    updateToken(state, token) {
      state.token = token;
      this.commit('m_user/saveTokenToStorage')
    },
    saveTokenToStorage(state) {
      uni.setStorageSync('token', state.token)
    },
    // 更新重定向信息
    updateRedirectInfo(state, info) {
      state.redirectInfo = info
    }
  },

  getters: {
    addstr(state) {
      if (!state.address.provinceName) return ''
      return state.address.provinceName + state.address.cityName + state.address.detailInfo
    }
  }
}