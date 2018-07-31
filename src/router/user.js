import User from '../views/user/User'
import UserDetail from '../views/user/UserDetail'
import UserAssets from '../views/user/UserAssets'
import FlowCenter from '../views/user/FlowCenter'
import Withdraw from '../views/user/Withdraw'
import UserLogin from '../views/login/UserLogin'
import Card from '../views/user/card'
import BindCard from '../views/user/card/BindCard'
import Register from '../views/login/Register'
const userRoute = [
  {
    path: '/user',
    name: 'user',
    meta: {
      needLogin: true,
      showTabbar: true
    },
    component: User
  }, {
    path: '/user/:type',
    name: 'user',
    meta: { needLogin: true },
    component: UserDetail
  }, {
    path: '/userAssets',
    name: 'userAssets',
    meta: { needLogin: true },
    component: UserAssets
  }, {
    path: '/login/userLogin',
    name: 'login',
    component: UserLogin
  }, {
    path: '/card',
    name: 'card',
    meta: { needLogin: true },
    component: Card
  }, {
    path: '/card/bind',
    name: 'card',
    meta: { needLogin: true },
    component: BindCard
  }, {
    path: '/form/:type',
    name: 'form',
    component: Register
  }, {
    path: '/flowCenter/:tab',
    name: 'flowCenter',
    meta: { needLogin: true },
    component: FlowCenter
  }, {
    path: '/withdraw',
    name: 'withdraw',
    meta: { needLogin: true },
    component: Withdraw
  }
]

export default userRoute
