<script setup>
// @ is an alias for src, making this an absolute path
import SearchSongCard from '@/components/SearchSongCard.vue';
import { ref, onMounted } from 'vue';
import SpotifyDataService from '@/services/SpotifyDataService.js';

const songsData = ref(null);
const searchQuery = ref('');
const results = ref(null);
const isShrunk = ref(false);

function search() {
  isShrunk.value = true;
  if (!searchQuery.value) return;
  SpotifyDataService.searchTracksEndpoint(searchQuery.value)
    .then(response => {
      results.value = response.data;
    })
    .catch(error => {
      console.error("Search failed:", error);
    });
  }
</script>


<template>
  <div>
    <div :class="{'search-bar-container': true, 'shrunken': isShrunk}">
      <input
        v-model="searchQuery"
        placeholder="Search for songs..."
        @keyup.enter="search"
        class="search-bar"
      />
    </div>


    <div v-if="results" class="song-cards-container">
      <SearchSongCard v-for="song in results.tracks.items" :key="song.id" :cardProp="song" />
    </div>
  </div>
</template>

<style scoped>

.search-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  transition: all 0.3s ease-in-out;
  width: 100%;
}

.search-bar-container.shrunken {
  width: 50%;
  padding: 5px 20px;
}

.search-bar {
  font-size: 20px;
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: none;
  outline: none;
  font-family: 'Arial', sans-serif;
  text-align: center;
  transition: width 0.3s ease-in-out;
}

.search-bar::placeholder {
  font-size: 18px;
  color: #999;
}

.search-bar:focus {
  outline: none;
  box-shadow: 0 0 8px rgba(255, 165, 0, 0.8);
}

.song-cards-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
}

</style>