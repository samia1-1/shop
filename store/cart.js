export default {
  namespaced: true,

  state: () => ({
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),

  mutations: {
    addToCart(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!findResult) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },

    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车商品的选中状态
    updateGoodsState(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        findResult.goods_state = goods.goods_state
        this.commit('m_cart/saveToStorage')
      }
    },
    updateGoodsCount(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        findResult.goods_count = goods.goods_count
        this.commit('m_cart/saveToStorage')
      }
    },
    // 删除购物车商品
    removeGoodsById(state, goods) {
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      if (findResult) {
        state.cart.splice(state.cart.indexOf(findResult), 1)
        this.commit('m_cart/saveToStorage')
      }
    }
  },

  getters: {
    total(state) {
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    checkedCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) =>
        total += item.goods_count, 0)
    }
  }
}