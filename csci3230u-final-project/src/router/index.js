import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TopSongsView from '@/views/TopSongsView.vue'
import BrowseView from '@/views/BrowseView.vue';
import SongDetailView from '@/views/SongDetailView.vue';
import ArtistDetailView from '@/views/ArtistDetailView.vue';
import AlbumDetailView from '@/views/AlbumDetailView.vue';


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
    },
    { 
      path: '/song/:id', 
      name: 'SongDetail', 
      component: SongDetailView, 
      props: true 
    },
    {
      path: '/artist/:id',
      name: 'ArtistDetail',
      component: ArtistDetailView,
      props: true 
    }, 
    {
      path: '/album/:id',
      name: 'AlbumDetail',
      component: AlbumDetailView,
      props: true 
    }
  ],
})

export default router
