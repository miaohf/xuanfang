/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const labelsRouter = {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      {
        name: '号签管理',
        path: 'labels',
        component: () => import('@/views/labels/List'),
      },
    ],
  }
  
  export default labelsRouter