import Vue from 'vue'
import VueRouter from 'vue-router'

/* import Login from '../components/Login'
import Home from '../components/home'
import Welcome from '../components/welcome' */

const Login = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/Login.vue')
const Home = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/home.vue')
const Welcome = () => import(/* webpackChunkName: 'login_home_welcome' */ '../components/welcome.vue')
/* import Users from '../components/user/users'
import Rights from '../components/power/rights'
import Roles from '../components/power/roles' */
const Users = () => import(/* webpackChunkName: 'users_rights_roles' */ '../components/user/users.vue')
const Rights = () => import(/* webpackChunkName: 'users_rights_roles' */ '../components/power/rights.vue')
const Roles = () => import(/* webpackChunkName: 'users_rights_roles' */ '../components/power/roles.vue')
/* import Cate from '../components/goods/cate'
import Params from '../components/goods/params'
import GoodList from '../components/goods/list'
import Add from '../components/goods/add' */
const Cate = () => import(/* webpackChunkName: 'goods' */ '../components/goods/cate.vue')
const Params = () => import(/* webpackChunkName: 'goods' */ '../components/goods/params.vue')
const GoodList = () => import(/* webpackChunkName: 'goods' */ '../components/goods/list.vue')
const Add = () => import(/* webpackChunkName: 'goods' */ '../components/goods/add.vue')

const Order = () => import(/* webpackChunkName: 'reports' */ '../components/order/order.vue')

// import Report from '../components/echarts/echarts'
const Report = () => import(/* webpackChunkName: 'reports' */ '../components/echarts/echarts.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/goods',
        component: GoodList
      },
      {
        path: '/goods/add',
        component: Add
      },
      {
        path: '/reports',
        component: Report
      },
      {
        path: '/orders',
        component: Order
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to: 将要访问的路径
  // from: 代表从哪个路径跳转而来
  // next: 是一个函数，表示放行，next () 放行， next('/login') 强制跳转
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
