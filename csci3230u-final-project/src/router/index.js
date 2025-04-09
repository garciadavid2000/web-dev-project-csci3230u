import { createRouter, createWebHistory } from 'vue-router'
import { useUserDataStore } from '@/stores/userData.js'
import HomeView from '../views/HomeView.vue'
import DashboardView from '@/views/DashboardView.vue'
import TopSongsView from '@/views/TopSongsView.vue'
import BrowseView from '@/views/BrowseView.vue';
import SongDetailView from '@/views/SongDetailView.vue';
import ArtistDetailView from '@/views/ArtistDetailView.vue';
import AlbumDetailView from '@/views/AlbumDetailView.vue';
import TuneRankView from '@/views/TuneRankView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/top-songs',
      name: 'top-songs',
      component: TopSongsView,
      meta: { requiresAuth: true },
    },
    { 
      path: '/browse', 
      name: 'Browse', 
      component: BrowseView,
      meta: { requiresAuth: true },
    },
    { 
      path: '/tunerank', 
      name: 'TuneRank', 
      component: TuneRankView,
      meta: { requiresAuth: true },
    },
    { 
      path: '/song/:id', 
      name: 'SongDetail', 
      component: SongDetailView, 
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/artist/:id',
      name: 'ArtistDetail',
      component: ArtistDetailView,
      props: true,
      meta: { requiresAuth: true },
    }, 
    {
      path: '/album/:id',
      name: 'AlbumDetail',
      component: AlbumDetailView,
      props: true,
      meta: { requiresAuth: true },
    }
  ],
})

// Navigation guard to check authentication
router.beforeEach(async (to) => {
  const userDataStore = useUserDataStore();

  if (to.meta.requiresAuth && !userDataStore.userData) {
    await userDataStore.getUserData();

    if (!userDataStore.userData) {
      // Redirect to home if not authenticated
      return { name: 'home' };
    }
  }


  return true;
});


export default router