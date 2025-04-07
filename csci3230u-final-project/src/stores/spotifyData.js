import { ref, /* computed */ } from 'vue'
import { defineStore } from 'pinia'
import SpotifyDataService from '@/services/SpotifyDataService'

export const useSpotifyDataStore = defineStore('spotifyData', () => {
  const topTracks = ref(null);
  const topArtists = ref(null);
  const recentlyPlayedTracks = ref(null);
  const isLoading = ref(false);

  // example of computed property if necessary
  // const doubleCount = computed(() => count.value * 2) 
  
  async function getTopTracks(limit = 5, time_range = 'short_term') {
    if (topTracks.value === null || topTracks.value.length !== limit) {
      isLoading.value = true;
      try {
        const response = await SpotifyDataService.getTopTracksEndpoint(limit, time_range);
        topTracks.value = response.data;
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  async function getTopArtists(limit = 5, time_range = 'short_term') {
    if (topArtists.value === null || topArtists.value.length !== limit) {
      isLoading.value = true;
      try {
        const response = await SpotifyDataService.getTopArtistsEndpoint(limit, time_range);
        topArtists.value = response.data;
      } catch (error) {
        console.error("Error fetching top artists:", error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  async function getRecentlyPlayedTracks() {
    if (recentlyPlayedTracks.value === null) {
      isLoading.value = true;
      try {
        const response = await SpotifyDataService.getRecentlyPlayedTracksEndpoint();
        recentlyPlayedTracks.value = response.data;
      } catch (error) {
        console.error("Error fetching recently played tracks:", error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  async function getUserData() {
    if (userData.value === null) {
      isLoading.value = true;
      try {
        const response = await SpotifyDataService.getUserEndpoint();
        userData.value = response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        isLoading.value = false;
      }
    }
  }

  return { 
    topTracks, 
    topArtists, 
    recentlyPlayedTracks, 
    isLoading, 
    getTopTracks, 
    getTopArtists, 
    getRecentlyPlayedTracks
  }
})
