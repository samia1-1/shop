<template>
  <view class="my-settle-container">
    <!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck" /><text>全选</text>
    </label>
    <!-- 合计 -->
    <view class="amount-box">
      合计：<text class="amout">￥{{checkedGoodsAmount}}</text>
    </view>
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算{{checkedCount}}</view>
  </view>
</template>

<script>
  import {
    mapGetters,
    mapMutations,
    mapState,
  } from 'vuex'
  export default {
    name: "my-settle",
    data() {
      return {
        seconds: 3, // 倒计时秒数
        timer: null // 定时器，用于倒计时
      };
    },
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_cart', ['cart']),
      ...mapState('m_user', ['token']),
      isFullCheck() {
        return this.checkedCount === this.total
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck);
      },
      // 结算按钮点击事件
      settlement() {
        // 检查是否有选中的商品
        if (!this.checkedCount) return uni.$showMsg('请选择商品');
        // 检查是否有收货地址
        if (!this.addstr) return uni.$showMsg('请先选择收货地址');
        // 检查是否登录
        if (!this.token) return this.delayedLogin();

        this.payOrder();
      },
      // 支付订单
      async payOrder() {
        //1.创建订单
        const orderInfo = {
          order_price: this.checkedGoodsAmount,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x = ({
            goods_id: x.goods_id,
            goods_number: x.goods_count,
            goods_price: x.goods_price
          }))
        }

        const {
          data: res
        } = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if (res.meta.status !== 200) return uni.$showMsg('创建订单失败，请稍后再试');
        const orderNumber = res.message.order_number;

        //2.预支付
        const {
          data: res2
        } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {
          order_number: orderNumber
        })
        if (res2.meta.status !== 200) return uni.$showMsg('预支付失败，请稍后再试');
        const payInfo = res2.message.pay;

        //3.发起支付
        const [err, succ] = await uni.requestPayment(payInfo)

        if (err) return uni.$showMsg('订单未支付');

        const {
          data: res3
        } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {
          order_number: orderNumber
        })
        if (res3.meta.status !== 200) return uni.$showMsg('支付失败，请稍后再试');
        uni.showToast({
          title: '支付成功',
          icon: 'success'
        })
      },

      // 延迟跳转到登录页面
      delayedLogin() {
        this.seconds = 3; // 重置倒计时秒数
        this.showTips(this.seconds);

        this.timer = setInterval(() => {
          this.seconds--;
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.switchTab({
              url: '/pages/my/my',
              success: () => {
                this.updateRedirectInfo({
                  openType: 'switchTab',
                  from: '/pages/cart/cart'
                })
              }
            });
            return;
          }
          this.showTips(this.seconds);
        }, 1000)
      },
      // 显示提示信息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + '秒后自动跳转到登录页。',
          mask: true,
          duration: 1500
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;

    .radio {
      display: flex;
      align-items: center;
    }

    .amount-box {
      .amount {
        color: #C00000;
        font-weight: bold;
      }
    }

    .btn-settle {
      background-color: #C00000;
      height: 50px;
      color: white;
      line-height: 50px;
      padding: 0 10px;
      min-width: 100px;
      text-align: center;
    }
  }
</style>