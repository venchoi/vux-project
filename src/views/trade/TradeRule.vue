<template>
  <div class="trade-rule-page">
    <x-header :left-options="{backText: ''}" style="background-color:#EA3939;">交易规则</x-header>
    <div class="rules-container">
      <section class="section">
        <h3 class="section-title">合约标的</h3>
        <p class="section-content">上证50交易型开放式指数证券投资基金（“50ETF”）</p>
      </section>
      <section class="section">
        <h3 class="section-title">交易时间</h3>
        <p class="section-content">9:30-11:30、13:00-15:00</p>
        <p class="section-content">本系统仅支持期权买方的开平仓功能</p>
      </section>
      <section class="section">
        <h3 class="section-title">合约类型</h3>
        <p class="section-content">认购期权和认沽期权</p>
      </section>
      <section class="section">
        <h3 class="section-title">到期日</h3>
        <p class="section-content">到期月份的第四个星期三（遇法定节假日顺延）</p>
        <p class="section-content">因行权手续繁琐，故本系统不支持行权申报，为保障您的利益，将于合约到期日前一天的14：30进行系统平仓处理，交易结果以实际为准。</p>
      </section>
      <section class="section">
        <h3 class="section-title">集合竞价</h3>
        <p class="section-content">9:15-9:25为开盘集合竞价时间</p>
        <p class="section-content">14:57-15:00为收盘集合竞价时间</p>
      </section>
      <section class="section">
        <h3 class="section-title">熔断交易规则</h3>
        <p class="section-content">连续竞价期间，期权合约盘中交易价格较最近参考价格涨跌幅度达到或者超过50%且价格涨跌绝对值达到或者超过5个最小报价单位时，期权合约进入3分钟的集合竞价交易阶段</p>
      </section>
    </div>
  </div>
</template>
<script>
import { XHeader } from 'vux'
export default {
  components: {
    XHeader
  }
}
</script>

<style lang="less" scoped>
.rules-container {
  padding: 10px;
}
.section {
  margin-bottom: 14px;
}
.section-title {
  font-weight: 550;
  color: #333;
  font-size: 13px;
  margin-bottom: 4pxs;
  position: relative;
  text-indent: 8px;
}
.section-title::before {
  content: '';
  position: absolute;
  width: 2px;
  height: 13px;
  background-color: red;
  border-radius: 5px;
  left: 0;
  top: 4px;
}
.section-content {
  color: #666;
  font-size: 12px;
  line-height: 22px;
}
</style>
