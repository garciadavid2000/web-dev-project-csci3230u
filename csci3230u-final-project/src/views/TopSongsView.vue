<script setup>
// @ is an alias for src, making this an absolute path
import SongCard from '@/components/SongCard.vue';
import { ref, onMounted } from 'vue';
import SpotifyDataService from '@/services/SpotifyDataService.js';

const songsData = ref(null);

onMounted(() => {
    SpotifyDataService.getTopTracksEndpoint()
    .then((response) => {
      // Return the data from the response
      songsData.value = response.data;
    }
    ).catch((error) => {
      console.error('Error fetching top tracks:', error);
    });
})

</script>


<template>
    <div v-if="songsData">
        <SongCard v-for="song in songsData.tracks" :key="song.name" :cardProp="song" />
    </div>
</template>