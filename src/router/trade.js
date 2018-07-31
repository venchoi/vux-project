import Trading from '../views/trading/Trading'
import Trade from '../views/trade/Trade'
import TradeRule from '../views/trade/TradeRule'
import TradeTab from '../views/trade/TradeTab'
const tradeRoute = [{
  path: '/trading',
  name: 'trading',
  component: Trading
}, {
  path: '/trade',
  name: 'trade',
  component: Trade,
  meta: {
    showTabbar: true
  }
}, {
  path: '/tradeRule',
  name: 'trade',
  component: TradeRule
}, {
  path: '/trade/:tab',
  name: 'trade',
  component: TradeTab
}, {
  path: '/trade/:tab/:type',
  name: 'trade',
  component: TradeTab
}
]
export default tradeRoute
