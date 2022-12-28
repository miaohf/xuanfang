/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'

const podcastRouter = {
  path: '/podcast',
  component: () => import('@/views/base/Index'),
  children: [
    {
      name: '播报叫号',
      path: 'podcast',
      component: () => import('@/views/podcast/podcast.vue'),
    },
    {
      name: '叫号控制',
      path: 'controlvoice',
      component: () => import('@/views/podcast/controlVoice.vue'),
    },
  ],
}

export default podcastRouter
