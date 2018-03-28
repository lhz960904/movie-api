import AC from '../components/async_load'

export default [
  {
    name: '首页',
    icon: 'home',
    path: '/',
    component: AC(() => import('../views/home'))
  },
  {
    name: '登陆页',
    path: '/login',
    component: AC(() => import('../views/login'))
  }
]