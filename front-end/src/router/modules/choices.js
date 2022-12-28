/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const choicesRouter = {
    path: '/',
    component: () => import('@/views/base/Index'),
    children: [
      {
        name: '预选方案',
        path: 'choices',
        component: () => import('@/views/choices/addChoice'),
      },
    ],
  }
  
  export default choicesRouter
  
  
  
  