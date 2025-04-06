import { ref, /* computed */ } from 'vue'
import { defineStore } from 'pinia'
import SpotifyDataService from '@/services/SpotifyDataService'

export const useSpotifyDataStore = defineStore('spotifyData', () => {
  const userData = ref(null);
  const topTracks = ref(null);
  const topArtists = ref(null);
  const recentlyPlayedTracks = ref(null);

  // example of computed property if necessary
  // const doubleCount = computed(() => count.value * 2) 
  
  async function getTopTracks() {
    if (topTracks.value === null) {
      try {
        const response = await SpotifyDataService.getTopTracksEndpoint();
        topTracks.value = response.data;
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    }
  }

  return { topTracks, getTopTracks }
})
