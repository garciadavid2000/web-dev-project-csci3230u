<script setup>
// @ is an alias for src, making this an absolute path
import SearchSongCard from '@/components/SearchSongCard.vue';
import SearchArtistCard from '@/components/SearchArtistCard.vue';
import { useSpotifyDataStore } from '@/stores/spotifyData';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const spotifyDataStore = useSpotifyDataStore();
const { topTracks, topArtists } = storeToRefs(spotifyDataStore);


onMounted(async () => {
  await spotifyDataStore.getTopTracks(50, 'long_term'); // make sure the data has loaded
  await spotifyDataStore.getTopArtists(50, 'long_term'); // make sure the data has loaded
})

</script>


<template>
    <div class="hof-container">
      <div v-if="topTracks" class="song-cards-container">
          <h2>Your Top Songs:</h2>
          <SearchSongCard
            v-for="song in topTracks.items"
            :key="song.id"
            :cardProp="song"
            cardType="song"
          />
    </div>
    <div v-if="topArtists" class="album-cards-container">
        <h2>Your Top Artists:</h2>
        <SearchArtistCard
          v-for="album in topArtists.items"
          :key="album.id"
          :cardProp="album"
          cardType="album"
        />
    </div>
    </div>
</template>

<style scoped>
.hof-container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 20px;
  padding: 0 40px;
}
</style>