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

</template>