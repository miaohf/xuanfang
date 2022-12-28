/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const contractsRouter = {
  path: '/',
  component: () => import('@/views/base/Index'),
  children: [
    {
      name: '扫码签约',
      path: 'contracts/scan',
      component: () => import('@/views/contracts/List'),
    },

    // {
    //   name: '触屏签约',
    //   path: 'contracts/touch',
    //   component: () => import('@/views/contracts/HuiminContract'),

    // },
    {
      name: '打印签单',
      path: 'contracts/:id/certificate',
      component: () => import('@/views/contracts/Print'),
    },
    {
      name: '客户签单',
      path: 'contracts/customer/:id',
      component: () => import('@/views/contracts/PrintByCustomer'),
    },
  ],
}

export default contractsRouter



