/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const houseRouter = {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      {
        name: '房源列表',
        path: 'houses',
        component: () => import('@/views/houses/List'),
      },
    ],
  }
  
  export default houseRouter