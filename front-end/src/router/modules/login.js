/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const loginRouter = {
  path: '/user',
  component: () => import('@/views/login/Index'),
  children: [
    {
      name: '登录页',
      path: 'login',
      component: () => import('@/views/login/Login'),
    },
    {
      name: '锁定',
      path: 'lock',
      component: () => import('@/views/login/Lock'),
    },
  ],
}

export default loginRouter
