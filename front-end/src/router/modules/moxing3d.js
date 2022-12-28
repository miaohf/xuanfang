/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const qianyueRouter = {

  name: '签约数据',
  path: '/daping/qianyue',
  component: () => import('@/views/daping/Qianyue'),

}

export default qianyueRouter
