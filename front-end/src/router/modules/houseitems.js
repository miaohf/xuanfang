/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const houseitemsRouter = {
  path: '/',
  component: () => import('@/views/base/Index'),
  children: [

    {
      name: '户型详情',
      path: 'houseitems/:id',
      component: () => import('@/views/houseitems/Details'),
    },

  ],
}

export default houseitemsRouter



