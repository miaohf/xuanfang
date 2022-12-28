/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const billsRouter = {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      {
        name: '结算管理',
        path: 'bills/:id',
        component: () => import('@/views/bills/List'),
      },
      {
        name: '打印结算单',
        path: 'bills/:id/print',
        component: () => import('@/views/bills/PrintBill'),
      },
    ],
  }
  
  export default billsRouter