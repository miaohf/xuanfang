/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const slicelabelsRouter = {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      {
        name: '九色鹿安置房源分配',
        path: 'slicelabels',
        component: () => import('@/views/slicelabels/controlPanel'),
      },
      // {
      //   name: '倒计时',
      //   path: 'slicelabels/timer/:population',
      //   component: () => import('@/views/slicelabels/Timer'),
      // },
      {
        name: '抽签房源',
        path: 'slicelabels/houseslist',
        component: () => import('@/views/slicelabels/housesList'),
      },
      {
        name: '汇总数据',
        path: 'slicelabels/statistics',
        component: () => import('@/views/slicelabels/Statistics'),
      },
    ],
  }
  
  export default slicelabelsRouter
  
  
  
  