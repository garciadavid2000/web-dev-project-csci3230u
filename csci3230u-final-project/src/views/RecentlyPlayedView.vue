<script setup>
// @ is an alias for src, making this an absolute path
import SongCard from '@/components/SearchSongCard.vue';
// import SongCard from '@/components/SongCard.vue';
import { useSpotifyDataStore } from '@/stores/spotifyData';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const spotifyDataStore = useSpotifyDataStore();
const { topTracks } = storeToRefs(spotifyDataStore);

onMounted(async () => {
  await spotifyDataStore.getTopTracks(50, 'long_term'); // make sure the data has loaded
})
</script>


<template>
    <div v-if="topTracks">
        <SongCard v-for="song in topTracks.items" :key="song.id" :cardProp="song" />
    </div>
</template>