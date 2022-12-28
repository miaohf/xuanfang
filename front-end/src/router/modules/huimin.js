/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const huiminRouter = {

  name: '惠民选房',
  path: '/daping/huimin',
  component: () => import('@/views/daping/huimin'),

}

export default huiminRouter
