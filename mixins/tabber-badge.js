import {
  mapGetters,
} from 'vuex'
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
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