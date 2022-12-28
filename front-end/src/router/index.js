import Vue from 'vue'
import Router from 'vue-router'

/* Router Modules */
import housesRouter from './modules/houses'
import contractsRouter from './modules/contracts'
import customersRouter from './modules/customers'
import loginRouter from './modules/login'
import settingsRouter from './modules/settings'
import qianyueRouter from './modules/qianyue'
import mpRouter from './modules/mp'
import houseitemsRouter from './modules/houseitems'
import labelsRouter from './modules/labels'
import billsRouter from './modules/bills'
import choicesRouter from './modules/choices'
import slicelabelsRouter from './modules/slicelabels'
import podcastRouter from './modules/podcast'
import huiminRouter from './modules/huimin'
import huiminContractRouter from './modules/huimin-contract'
Vue.use(Router)

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      // Dashboard
      {
        name: 'Dashboard',
        path: '',
        component: () => import('@/views/dashboard/Dashboard'),
      },
    ],
  },
  loginRouter,
  housesRouter,
  contractsRouter,
  customersRouter,
  settingsRouter,
  qianyueRouter,
  mpRouter,
  houseitemsRouter,
  labelsRouter,
  billsRouter,
  choicesRouter,
  slicelabelsRouter,
  podcastRouter,
  huiminRouter,
  huiminContractRouter
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  /** when your routing map is too long, you can split it into small modules **/

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
