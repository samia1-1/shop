import {
  mapGetters,
} from 'vuex'
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  watch: {
    total() {
      // 监听total变化时，重新设置角标
      this.setBadge()
    }
  },
  // 页面被打开时触发
  onShow() {
    this.setBadge()
  },
  methods: {
    //设置购物车角标
    setBadge() {
      uni.setTabBarBadge({
        index: 2,
        text: this.total + ''
      })
    },
  },
}