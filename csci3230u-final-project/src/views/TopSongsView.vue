<script setup>
// @ is an alias for src, making this an absolute path
import SongCard from '@/components/SongCard.vue';
import { useSpotifyDataStore } from '@/stores/spotifyData';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';

const spotifyDataStore = useSpotifyDataStore();
const { topTracks } = storeToRefs(spotifyDataStore);

onMounted(async () => {
  await spotifyDataStore.getTopTracks(); // make sure the data has loaded
})

</script>


<template>
    <div v-if="topTracks">
        <SongCard v-for="song in topTracks.tracks" :key="song.name" :cardProp="song" />
    </div>
</template>