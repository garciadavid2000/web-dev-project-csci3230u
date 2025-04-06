import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TopSongsView from '@/views/TopSongsView.vue'
import BrowseView from '@/views/BrowseView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView
    },
    {
      path: '/top-songs',
      name: 'top-songs',
      component: TopSongsView
    },
    { 
      path: '/browse', 
      name: 'Browse', 
      component: BrowseView
    }
  ],
})

export default router
