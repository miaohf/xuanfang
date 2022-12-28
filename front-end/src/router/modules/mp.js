/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const mpRouter = {
  path: '/mp',
  component: () => import('@/views/mp/Index'),
  children: [
    {
      name: 'mp',
      path: 'mp/:garden_id',
      component: () => import('@/views/mp/mp'),
    },
  ],
}

export default mpRouter
