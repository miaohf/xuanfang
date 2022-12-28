/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const settingsRouter = {
  path: '/settings',
  component: () => import('@/views/base/Index'),
  children: [
    {
      name: '账号',
      path: 'users',
      component: () => import('@/views/settings/users'),
    },
    // {
    //   name: '统计',
    //   path: 'statistics',
    //   component: () => import('@/views/settings/statistcis'),
    // },
    // {
    //   name: '作者列表',
    //   path: 'authors',
    //   component: () => import('@/views/settings/authors'),
    // },
    // {
    //   name: '图书馆列表',
    //   path: 'libraries',
    //   component: () => import('@/views/settings/libraries'),
    // },
  ],
}

export default settingsRouter
