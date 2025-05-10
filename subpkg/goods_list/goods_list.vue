<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj: {
          //查询关键词
          query: '',
          //分类id
          cid: '',
          //页码
          pagenum: 1,
          //页大小
          pagesize: 10,
        },
        //商品列表
        goodsList: [],
        //总数量
        total: 0,
        isloding: false,
      };
    },
    onLoad(option) {
      this.queryObj.cid = option.cid || ''
      this.queryObj.query = option.query || ''
      this.getGoodsList()
    },
    methods: {
      //获取商品列表
      async getGoodsList(cb) {
        this.isloding = true
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        this.isloding = false
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
      },
      // 跳转详情页
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?id=' + goods.goods_id
        })
      }
    },
    
    onReachBottom(){
      // 判断是否还有数据
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      // 判断是否正在加载数据
      if(this.isloding) return
      // 让页码自增
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    onPullDownRefresh() {
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">
</style>