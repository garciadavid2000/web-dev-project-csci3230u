<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue'
import SearchArtistCard from '@/components/SearchArtistCard.vue'

const topTracks = ref([])
const topArtists = ref([])

onMounted(async () => {
  const [tracksRes, artistsRes] = await Promise.all([
    SpotifyDataService.getTopTracks(),
    SpotifyDataService.getTopArtists()
  ])
  topTracks.value = tracksRes.data.items
  topArtists.value = artistsRes.data.items
})

</script>

<template>
    <div class="tunerank-container">
      <h1>TuneRank</h1>
      <p>Calculating your underground score...</p>
      <!-- We'll show the score here later -->
    </div>
  </template>
  
  <style scoped>
  .tunerank-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
  </style>