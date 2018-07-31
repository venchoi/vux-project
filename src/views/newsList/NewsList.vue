<template>
  <view-box class="news-list-page">
    <div class="flow-center-page">
      <div>
        <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">公告资讯</x-header>
        <scroller :lock-x="true" @on-scroll-bottom="reachBottom" class="scroll-container">
          <div class="viewbox-container">
            <panel :list="newsList" :type="$t('4')"></panel>
            <load-more tip="加载更多" :show-loading="loading" background-color="#fbf9fe"></load-more>
          </div>
        </scroller>
      </div>
    </div>
  </view-box>
</template>
<script>
import { ViewBox, XHeader, Panel, LoadMore, Scroller } from 'vux'
import ajax from '../../plugins/ajax'
import baseUtil from '../../util/baseUtil'
export default {
  data () {
    return {
      newsList: [],
      minId: '',
      loading: false,
      hasData: true,
      limit: false
    }
  },
  mounted () {
    this.requestData(true)
  },
  methods: {
    requestData (isInit) {
      if (!this.limit && this.hasData) {
        const vm = this
        const param = {
          is_index: 0,
          min_id: vm.minId
        }
        this.limit = true
        this.loading = true
        ajax.NEWS_LIST({
          param,
          success: (res) => {
            this.limit = false
            this.loading = false
            if (res.error_code === '0' && res.data && res.data.newsList) {
              if (res.data.newsList.length > 0) {
                const newsList = res.data.newsList
                vm.minId = res.data.minId
                baseUtil.each(newsList, (news) => {
                  const newsItem = {
                    title: news.title,
                    url: {
                      path: `/news/${news.news_id}`,
                      replace: false
                    },
                    meta: {
                      date: news.update_time
                    }
                  }
                  vm.newsList.push(newsItem)
                })
              } else {
                this.hasData = false
              }
            }
          }
        })
      }
    },
    reachBottom () {
      this.requestData(false)
    }
  },
  components: {
    XHeader,
    ViewBox,
    Panel,
    LoadMore,
    Scroller
  }
}
</script>
