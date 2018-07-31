import Market from '../views/market/Market'
import MarketDetail from '../views/market/MarketDetail'
import MainMarket from '../views/market/MainMarket'
const marketRoute = [
  {
    path: '/market',
    name: 'market',
    component: Market,
    meta: {
      showTabbar: true
    }
  }, {
    path: '/marketDetails/:code',
    name: 'marketDetails',
    component: MarketDetail
  }, {
    path: '/mainMarket',
    name: 'marketDetails',
    component: MainMarket
  }
]
export default marketRoute
