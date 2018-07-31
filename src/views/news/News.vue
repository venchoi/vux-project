<template>
  <div class="news-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">详情</x-header>
    <h3 class="news-page-title">{{title}}</h3>
    <div v-html="content"></div>
  </div>
</template>
<script>
import { XHeader } from 'vux'
import ajax from '../../plugins/ajax'
export default {
  data () {
    return {
      newsId: this.$route.params.newsId,
      content: '',
      title: '',
      updateTime: ''
    }
  },
  mounted () {
    const vm = this
    const param = {
      news_id: Number(vm.newsId)
    }
    ajax.NEWS_INFO({
      param,
      success: (res) => {
        if (res.error_code === '0') {
          this.content = res.data.content
          this.title = res.data.title
          this.updateTime = res.data.updateTime
        }
      }
    })
  },
  components: {
    XHeader
  }
}
</script>
<style lang="less">
.news-page {
  width: 100%;
  overflow: hidden;
}
img {
  max-width: 100%;
}
.news-page-title {
  margin-top: 8px;
  text-align: center;
}
</style>

