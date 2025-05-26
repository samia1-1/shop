<template>
  <view class="cart-container" v-if='cart.length'>
    <!-- 收货地址 -->
    <my-address></my-address>
    <!-- 商品列表标题 -->
    <view class="cart-title">
      <!-- 左侧图标 -->
      <uni-icons type="shop" size="18"></uni-icons>
      <!-- 右侧文本 -->
      <text class="cart-title-text">购物车</text>
    </view>

    <!-- 渲染购物车信息 -->
    <uni-swipe-action>
      <block v-for="(good, i) in cart" :key="i" class="cart-item">
        <uni-swipe-action-item :right-options="options" @click="swiperItemClickHandler(goods)">
          <my-goods :goods="good" :show-radio="true" :showNum="true" @radio-change="radioChangeHandler"
            @num-change="numberChangeHandler"></my-goods></uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 结算 -->
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车页面 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">空空如也</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabber-badge.js'
  import {
    mapState,
    mapMutations,
  } from 'vuex'

  export default {
    mixins: [badgeMix],
    computed: {
      ...mapState('m_cart', ['cart'])
    },
    data() {
      return {
        options: [{
          text: '删除',
          style: {
            backgroundColor: '#FF0000',
          },
        }],
      }
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),

      radioChangeHandler(e) {
        // 处理单选框变化事件
        this.updateGoodsState(e)
      },

      numberChangeHandler(e) {
        this.updateGoodsCount(e)
      },

      swiperItemClickHandler(goods) {
        // 处理滑动删除事件
        this.removeGoodsById(goods)
      },
    },
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;

    .cart-title {
      height: 40px;
      display: flex;
      align-items: center;
      padding-left: 5px;
      border-bottom: 1px solid #efefef;

      .cart-title-text {
        font-size: 14px;
        margin-left: 10px;
      }
    }
  }
  
  .empty-cart{
    display: flex;
    flex-direction:column;
    align-items: center;
    padding-top: 150px;
    .empty-img{
      width:90px;
      height:90px;
    }
    .tip-text{
      font-size:12px;
      color:gray;
      margin-top: 15px;
    }
  }
</style>