/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const customersRouter = {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      {
        name: '户主列表',
        path: 'customers',
        component: () => import('@/views/customers/List'),
      },
      {
        name: '打印客户',
        path: 'customers/:id/print',
        component: () => import('@/views/customers/Print'),
      },
      {
        name: '户主详情',
        path: 'customers/:id',
        component: () => import('@/views/customers/Details'),
      },
      // {
      //   name: '预选方案',
      //   path: 'customers/:id/choice',
      //   component: () => import('@/views/customers/addChoice'),
      // },
    ],
  }
  
  export default customersRouter
  
  
  
  