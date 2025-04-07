<script setup>
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js';

const route = useRoute()
const songId = route.params.id
const track = ref(null)
const artist = ref(null)

onMounted(async () => {
  const id = route.params.id
  const response = await SpotifyDataService.getTrackById(id)
  track.value = response.data

  const artistId = track.value.artists[0].id
  const artistResponse = await SpotifyDataService.getArtistById(artistId)
  artist.value = artistResponse.data
})

const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs/60000);
    const seconds = Math.floor((durationMs%60000)/1000);
    return `${minutes}:${seconds<10?'0'+seconds:seconds}`;
};

</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-card">
      
      <div class="track-section">
        <img :src="track?.album?.images[0]?.url" alt="Track Cover" class="track-image" />
        <h2 class="track-name">{{ track?.name }}</h2>
        <p class="track-meta">Duration: {{ formatDuration(track?.duration_ms) }}</p>
        <p class="track-meta">Album: {{ track?.album?.name }}</p>
      </div>

      <div class="artist-section">
        <img :src="artist?.images[0]?.url" alt="Artist" class="artist-image" />
        <h2 class="artist-name">{{ artist?.name }}</h2>
        <p class="artist-meta">Followers: {{ artist?.followers?.total?.toLocaleString() }}</p>
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
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.track-section, .artist-section {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.track-section {
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

.artist-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.artist-name {
  margin-top: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
}

.artist-meta {
  font-size: 16px;
  color: #bbb;
  margin-top: 8px;
  text-align: center;
}

</style>