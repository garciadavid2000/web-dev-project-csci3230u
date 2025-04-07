<template>
  <div>
    <div :class="{'search-bar-container': true, 'shrunken': isShrunk}">
      <input
        v-model="searchQuery"
        placeholder="Search for songs..."
        @keyup.enter="search"
        class="search-bar"
        @focus="handleFocus"
      />
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
import { ref } from 'vue';
import SpotifyDataService from '@/services/SpotifyDataService.js';

const searchQuery = ref('');
const results = ref(null);
const isShrunk = ref(false);

const handleFocus = () => {
  isShrunk.value = true;
};

function search() {
  isShrunk.value = true;
  if (!searchQuery.value) return;
  SpotifyDataService.searchTracksEndpoint(searchQuery.value, 'track,artist,album')
    .then(response => {
      console.log("Search query:", response.data);
      results.value = response.data;
    })
    .catch(error => {
      console.error("Search failed:", error);
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
</style>
