import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/arm_trading/',
    name: 'Calendar',
    meta: {
      layout: 'main',
      title: 'calendar'
    },
    component: () => import('../components/views/trading-session/calendar/Calendar.vue')
  },
  {
    path: '/arm_trading/lot/:id',
    name: 'Trading',
    meta: {
      layout: 'main',
      title: 'lot'
    },
    component: () => import('../components/views/Trading.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
