<template>
  <div class="home-page" style="height:100%;">
    <view-box>
      <swiper v-if="advList.length > 0" :list="advList" auto height="260px" dots-class="custom-bottom" dots-position="center"></swiper>
      <grid :show-vertical-dividers="false" style="background: #fff;">
        <grid-item link="/recharge" :label="$t('充值')">
          <img slot="icon" src="../../assets/img/Home_icon_charge@2x.png">
        </grid-item>
        <grid-item link="/onlineService" :label="$t('在线客服')">
          <img slot="icon" src="../../assets/img/Home_icon_custom@2x.png">
        </grid-item>
        <grid-item link="/tradeRule" :label="$t('交易规则')">
          <img slot="icon" src="../../assets/img/Home_icon_tip@2x.png">
        </grid-item>
        <grid-item link="/guide" :label="$t('新手指引')">
          <img slot="icon" src="../../assets/img/Home_icon_new@2x.png">
        </grid-item>
      </grid>
      <div>
        <group>
          <cell is-link :title="$t('公告资讯')" value="更多" link="/newsList"></cell>
        </group>
        <panel :list="newsList" :type="$t('4')"></panel>
      </div>
    </view-box>
  </div>
</template>
<script>
import { ViewBox, Swiper, Grid, GridItem, Group, Cell, Panel } from 'vux'
import ajax from '../../plugins/ajax'
import baseUtil from '../../util/baseUtil'
export default {
  data() {
    return {
      advList: [],
      newsList: []
    }
  },
  mounted() {
    const param = {
      is_index: 1
    }
    ajax.NEWS_LIST({
      param,
      success: (res) => {
        const newsList = res.data.newsList
        const advList = res.data.indexAdv
        baseUtil.each(advList, (adv) => {
          const advItem = {
            img: adv
          }
          this.advList.push(advItem)
        })
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
          this.newsList.push(newsItem)
        })
      }
    })
  },
  components: {
    ViewBox,
    Swiper,
    Grid,
    GridItem,
    Group,
    Cell,
    Panel
  }
}
</script>
<style lang="less" scoped>
</style>


