/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const huiminContractRouter = {

  name: '惠民签约',
  path: '/contracts/touch',
  component: () => import('@/views/contracts/HuiminContract'),

}

export default huiminContractRouter

