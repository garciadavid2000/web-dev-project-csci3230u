<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue'
import SearchArtistCard from '@/components/SearchArtistCard.vue'

const route = useRoute()
const songId = route.params.id
const track = ref(null)
const artist = ref(null)

onMounted(async () => {
  try {
    // Fetch track details
    const response = await SpotifyDataService.getTrackById(songId)
    track.value = response.data

    // Fetch details for the first artist in the track
    const artistId = track.value.artists[0].id
    const artistResponse = await SpotifyDataService.getArtistById(artistId)
    artist.value = artistResponse.data
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
      <div class="track-section">
        <img :src="track?.album?.images[0]?.url" alt="Track Cover" class="track-image" />
        <h2 class="track-name">{{ track?.name }}</h2>
        <p class="track-meta">Duration: {{ formatDuration(track?.duration_ms) }}</p>
      </div>
      <div class="cards-column">
        <div class="album-card-section" v-if="track && track.album">
          Album:
          <SearchSongCard :cardProp="track.album" cardType="album" />
        </div>
        <div class="artist-card-section" v-if="artist">
          Artist:
          <SearchArtistCard :cardProp="artist" cardType="artist" />
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
}

.detail-card {
  display: flex;
  gap: 20px;
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.track-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  border-right: 2px solid #444;
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

.cards-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  justify-content: center;
  align-items: center;
}
.album-card-section,
.artist-card-section {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
