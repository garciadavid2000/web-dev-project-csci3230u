<template>
  <div>
    <div v-if="!isLoading" :class="{'search-bar-container': true, 'shrunken': isShrunk}">
      <input
        v-model="searchQuery"
        placeholder="Search for songs..."
        @keyup.enter="search"
        class="search-bar"
        @focus="handleFocus"
      />
    </div>
    <!-- Toggle Buttons -->
    <div v-if="!isLoading" class="toggle-buttons">
      <button
        :class="{'active-toggle': searchTypes.track, 'inactive-toggle': !searchTypes.track}"
        @click="toggleType('track')"
      >Songs</button>

      <button
        :class="{'active-toggle': searchTypes.album, 'inactive-toggle': !searchTypes.album}"
        @click="toggleType('album')"
      >Albums</button>

      <button
        :class="{'active-toggle': searchTypes.artist, 'inactive-toggle': !searchTypes.artist}"
        @click="toggleType('artist')"
      >Artists</button>

      <button class="refresh-button" @click="search">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-refresh-cw">
          <polyline points="23 4 23 10 17 10"></polyline>
          <polyline points="1 20 1 14 7 14"></polyline>
          <path d="M3.51 9a9 9 0 0114.36-3.36L23 10M1 14l5.14 5.36A9 9 0 0020.49 15"></path>
        </svg>

      </button>
    </div>
    <div v-if="isLoading" class="loader-container">
      <BrowseLoader v-if="loaderToggle"/>
      <!-- By Sam Herbert (@sherb), for everyone. More @ http://goo.gl/7AJzbL -->
      <svg v-if="!loaderToggle" width="55" height="80" viewBox="0 0 55 80" xmlns="http://www.w3.org/2000/svg" fill="#FFF">
          <g transform="matrix(1 0 0 -1 0 80)">
              <rect width="10" height="20" rx="3">
                  <animate attributeName="height"
                      begin="0s" dur="4.3s"
                      values="20;45;57;80;64;32;66;45;64;23;66;13;64;56;34;34;2;23;76;79;20" calcMode="linear"
                      repeatCount="indefinite" />
              </rect>
              <rect x="15" width="10" height="80" rx="3">
                  <animate attributeName="height"
                      begin="0s" dur="2s"
                      values="80;55;33;5;75;23;73;33;12;14;60;80" calcMode="linear"
                      repeatCount="indefinite" />
              </rect>
              <rect x="30" width="10" height="50" rx="3">
                  <animate attributeName="height"
                      begin="0s" dur="1.4s"
                      values="50;34;78;23;56;23;34;76;80;54;21;50" calcMode="linear"
                      repeatCount="indefinite" />
              </rect>
              <rect x="45" width="10" height="30" rx="3">
                  <animate attributeName="height"
                      begin="0s" dur="2s"
                      values="30;45;13;80;56;72;45;76;34;23;67;30" calcMode="linear"
                      repeatCount="indefinite" />
              </rect>
          </g>
      </svg>
    </div>
    <div class="search-results">
      <!-- Tracks Column -->
      <div v-if="results?.tracks?.items" class="song-cards-container">
        <h2>Searched Tracks:</h2>
        <SearchSongCard
          v-for="song in results.tracks.items"
          :key="song.id"
          :cardProp="song"
          cardType="song"
        />
      </div>
      <!-- Artists Column -->
      <div v-if="results?.artists?.items" class="artist-cards-container">
        <h2>Searched Artists:</h2>
        <SearchArtistCard
          v-for="artist in results.artists.items"
          :key="artist.id"
          :cardProp="artist"
          cardType="artist"
        />
      </div>
      <!-- Albums Column -->
      <div v-if="results?.albums?.items" class="album-cards-container">
        <h2>Searched Albums:</h2>
        <SearchAlbumCard
          v-for="album in results.albums.items"
          :key="album.id"
          :cardProp="album"
          cardType="album"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import SearchSongCard from '@/components/SearchSongCard.vue';
import SearchArtistCard from '@/components/SearchArtistCard.vue';
import SearchAlbumCard from '@/components/SearchAlbumCard.vue';
import { ref, computed } from 'vue';
import SpotifyDataService from '@/services/SpotifyDataService.js';
import BrowseLoader from '@/components/BrowseLoader.vue';

const searchQuery = ref('');
const results = ref(null);
const isShrunk = ref(false);

const handleFocus = () => {
  isShrunk.value = true;
};

const isLoading = ref(false);
const loaderToggle = ref(true);

const searchTypes = ref({
  track: true,
  album: true,
  artist: true
});

function toggleType(type) {
  searchTypes.value[type] = !searchTypes.value[type];
  //search(); //search again (basically reload search) with updated types
}

const activeTypes = computed(() => {
  return Object.entries(searchTypes.value)
    .filter(([_, active]) => active)
    .map(([type]) => type)
    .join(',');
});

function search() {
  isShrunk.value = true;
  isLoading.value = true;
  results.value = null;
  if (!searchQuery.value){
    isLoading.value = false;
    return;
  } 

  SpotifyDataService.searchTracksEndpoint(searchQuery.value, activeTypes.value)
    .then(response => {
      console.log("Search query:", response.data);
      results.value = response.data;
    })
    .catch(error => {
      console.error("Search failed:", error);
    })
    .finally(() => {
      isLoading.value = false;
      loaderToggle.value = !loaderToggle.value;
    });
}
</script>

<style scoped>
/* Your existing CSS styles remain here */
.search-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  transition: all 0.4s ease-in-out;
  width: 100%;
}

.search-bar-container.shrunken {
  justify-content: flex-start;
  width: 100%;
  padding-left: 20px;
}

.search-bar {
  font-size: 20px;
  width: 100%;
  padding: 15px;
  border-radius: 30px;
  border: none;
  outline: none;
  font-family: 'Arial', sans-serif;
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

.search-results {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-evenly;
  width: 100%;
  margin-top: 20px;
  padding: 0 40px;
}

.song-cards-container,
.artist-cards-container,
.album-cards-container {
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.loader-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
}

.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

button.active-toggle {
  background-color: rgb(255, 115, 0);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

button.inactive-toggle {
  background-color: #6e6e6e;
  color: #000000;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
}

.refresh-button {
  background-color: #444;
  border: none;
  padding: 10px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease-in-out;
  vertical-align: middle;
}

.refresh-button:hover {
  background-color: #666;
}

</style>
