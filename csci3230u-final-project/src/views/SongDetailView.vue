<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue'
import SearchArtistCard from '@/components/SearchArtistCard.vue'

const route = useRoute()
const songId = route.params.id
const track = ref(null)
const artists = ref([])

onMounted(async () => {
  try {

    const response = await SpotifyDataService.getTrackById(songId)
    track.value = response.data

    if (track.value && track.value.artists) {
      const artistIds = track.value.artists.map(a => a.id)
      const artistPromises = artistIds.map(id => SpotifyDataService.getArtistById(id))
      const artistResponses = await Promise.all(artistPromises)
      artists.value = artistResponses.map(resp => resp.data)
    }
  } catch (error) {
    console.error("Error loading track or artist details:", error)
  }
})

const formatDuration = (durationMs) => {
  const minutes = Math.floor(durationMs / 60000)
  const seconds = Math.floor((durationMs % 60000) / 1000)
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-card">
      <div class="main-column">
        <div class="track-section">
          <img :src="track?.album?.images[0]?.url" alt="Track Cover" class="track-image" />
          <h2 class="track-name">{{ track?.name }}</h2>
          <p class="track-meta">Duration: {{ formatDuration(track?.duration_ms) }}</p>
        </div>
        <!-- Popularity Bar -->
        <div class="popularity-bar-container">
          <span class="flame">🔥 Popularity Score: {{ track?.popularity }}%</span>
          <div class="popularity-bar">
            <div class="popularity-fill" :style="{ width: track?.popularity + '%' }"></div>
          </div>
        </div>
        <div class="album-section" v-if="track && track.album">
          <SearchSongCard :cardProp="track.album" cardType="album" />
        </div>
      </div>
      <div class="artists-column" v-if="artists.length">
        <h3>Artists</h3>
        <div class="artists-list">
          <SearchArtistCard
            v-for="artist in artists"
            :key="artist.id"
            :cardProp="artist"
            cardType="artist"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-wrapper {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  height: auto;
}

.detail-card {
  display: flex;
  gap: 20px;
  background-color: #252525;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  height: auto;
}
.main-column {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-right: 2px solid #444;
}

.track-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.track-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.track-name {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #ffa500;
  text-align: center;
}
.track-meta {
  font-size: 16px;
  color: #ccc;
  margin-top: 8px;
  text-align: center;
}

.album-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.album-section h3 {
  color: #ffa500;
}

.artists-column {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: flex-start;
  align-items: center;
}
.artists-column h3 {
  color: #ffa500;
  margin-bottom: 12px;
}
.artists-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.popularity-container {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 6px;
}

.flame {
  font-size: 20px;
  color: #c0c0c0;
  font-weight: bold;
  min-width: 100px;
}

.popularity-bar {
  flex-grow: 1;
  height: 8px;
  background-color: #7777776c;
  border-radius: 4px;
  overflow: hidden;
}

.popularity-fill {
  height: 100%;
  background-color: #FF5733;
  transition: width 0.3s ease;
}
</style>
