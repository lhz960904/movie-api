import AC from '../components/async_load'
import Login from '../views/login'

export default [
  {
    name: '首页',
    path: '/movie',
    component: AC(() => import('../views/home'))
  },
  {
    name: '用户页',
    path: '/user',
    component: AC(() => import('../views/user'))
  },
  {
    name: '数据页',
    path: '/chart',
    component: AC(() => import('../views/chart'))
  },
  {
    name: '登陆页',
    path: '/login',
    component: Login
  },
]