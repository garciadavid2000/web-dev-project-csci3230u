import { ref, /* computed */ } from 'vue'
import { defineStore } from 'pinia'
import SpotifyDataService from '@/services/SpotifyDataService'

export const useUserDataStore = defineStore('userData', () => {
  const userData = ref(null);
  const isLoading = ref(false);

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
    userData, 
    getUserData
  }
})
