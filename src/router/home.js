import Home from '../views/home/Home'
import MyStock from '../views/mystock/MyStock'
import AddStock from '../views/mystock/AddStock'
import Recharge from '../views/recharge/Recharge'
import BankTransform from '../views/recharge/BankTransform'
import OnlineService from '../views/onlineService/OnlineService'
import Guide from '../views/guide/Guide'
import NewsList from '../views/newsList/NewsList'
import News from '../views/news/News'
const homeRoute = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: {
      showTabbar: true
    }
  }, {
    path: '/home',
    name: 'home',
    component: Home,
    meta: {
      showTabbar: true
    }
  }, {
    path: '/mystock',
    name: 'mystock',
    component: MyStock,
    meta: {
      showTabbar: true
    }
  }, {
    path: '/recharge',
    name: 'recharge',
    component: Recharge
  }, {
    path: '/recharge/bankTransform',
    name: 'bankTransform',
    component: BankTransform
  }, {
    path: '/onlineService',
    name: 'onlineService',
    component: OnlineService
  }, {
    path: '/guide',
    name: 'guide',
    component: Guide
  }, {
    path: '/newsList',
    name: 'newsList',
    component: NewsList
  }, {
    path: '/news/:newsId',
    name: 'news',
    component: News
  }, {
    path: '/addStock',
    name: 'addStock',
    component: AddStock
  }
]
export default homeRoute
