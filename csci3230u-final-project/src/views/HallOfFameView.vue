<script setup>
import SearchSongCard from '@/components/SearchSongCard.vue';
import SearchArtistCard from '@/components/SearchArtistCard.vue';
import { useSpotifyDataStore } from '@/stores/spotifyData';
import { storeToRefs } from 'pinia';
import { ref, onMounted } from 'vue';

const spotifyDataStore = useSpotifyDataStore();
const { topTracks, topArtists } = storeToRefs(spotifyDataStore);

// Toggle states for showing top songs and artists
const showTopTracks = ref(true);
const showTopArtists = ref(true);

function toggleTracks() {
  showTopTracks.value = !showTopTracks.value;
}

function toggleArtists() {
  showTopArtists.value = !showTopArtists.value;
}

// ----- Filter Controls for Songs and Artists -----
const songsDepth = ref(5);
const songsTimeRange = ref('long_term');
const artistsDepth = ref(5);
const artistsTimeRange = ref('long_term');

// Reactive loading state (can be used elsewhere in your UI)
const loading = ref(false);
// Reactive rotation trigger for the SVG
const rotate = ref(false);

// Single function to fetch both songs and artists data
async function fetchAllData() {
  console.log("fetchAllData triggered");
  
  // Trigger the rotation animation.
  rotate.value = true;
  
  // Set loading state to true while fetching data.
  loading.value = true;
  try {
    await Promise.all([
      spotifyDataStore.getTopTracks(songsDepth.value, songsTimeRange.value),
      spotifyDataStore.getTopArtists(artistsDepth.value, artistsTimeRange.value)
    ]);
  } finally {
    loading.value = false;
    // After 1 second (animation duration), reset rotate to false.
    setTimeout(() => {
      rotate.value = false;
    }, 1000);
  }
}

// On mount, load both songs and artists data with default filters.
onMounted(async () => {
  await fetchAllData();
});
</script>

<template>
  <div class="main-container">
    <!-- Filters Section -->
    <div class="filters-container">
      <!-- Songs Filter Group -->
      <div class="filter-group">
        <h3>Songs Filters</h3>
        <div class="dropdowns">
          <div class="dropdown">
            <label for="songsDepth">Select number of songs:</label>
            <select v-model="songsDepth" id="songsDepth">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
          <div class="dropdown">
            <label for="songsTimeRange">Select time range:</label>
            <select v-model="songsTimeRange" id="songsTimeRange">
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Artists Filter Group -->
      <div class="filter-group">
        <h3>Artists Filters</h3>
        <div class="dropdowns">
          <div class="dropdown">
            <label for="artistsDepth">Select number of artists:</label>
            <select v-model="artistsDepth" id="artistsDepth">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="25">25</option>
            </select>
          </div>
          <div class="dropdown">
            <label for="artistsTimeRange">Select time range:</label>
            <select v-model="artistsTimeRange" id="artistsTimeRange">
              <option value="short_term">Short Term</option>
              <option value="medium_term">Medium Term</option>
              <option value="long_term">Long Term</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!--Button by Jaydip Prajapati link: https://uiverse.io/JaydipPrajapati1910/dry-frog-0 -->
    <button type="button" class="fetch-btn" @click="fetchAllData">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrow-repeat"
        :class="{ rotating: rotate }"
        viewBox="0 0 16 16"
      >
        <path
          d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"
        ></path>
        <path
          fill-rule="evenodd"
          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
        ></path>
      </svg>
      Refresh
    </button>

    <div class="spacer"></div>

    <div class="toggle-buttons">
      <button 
        :class="{'active-toggle': showTopTracks, 'inactive-toggle': !showTopTracks}" 
        @click="toggleTracks">
        Top Songs
      </button>
      <button 
        :class="{'active-toggle': showTopArtists, 'inactive-toggle': !showTopArtists}" 
        @click="toggleArtists">
        Top Artists
      </button>
    </div>

    <div class="hof-container">
      <div v-if="showTopTracks && topTracks" class="song-cards-container">
        <h2>Your Top Songs:</h2>
        <SearchSongCard
          v-for="song in topTracks.items"
          :key="song.id"
          :cardProp="song"
          cardType="song"
        />
      </div>
      <div v-if="showTopArtists && topArtists" class="artist-cards-container">
        <h2>Your Top Artists:</h2>
        <SearchArtistCard
          v-for="artist in topArtists.items"
          :key="artist.id"
          :cardProp="artist"
          cardType="artist"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

/* Filters container styling */
.filters-container {
  display: flex;
  flex-direction: row;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dropdowns {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-size: 1.1rem;
  color: #ccc;
}

select {
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #333;
  color: #fff;
  width: 120px;
  transition: background-color 0.3s ease;
}

select:hover {
  background-color: #555;
}

/* Refresh button styling */
.fetch-btn {
  color: white;
  background-color: #ff7300;
  font-weight: bold;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 2rem;
  padding: 0.7rem 2rem;
  cursor: pointer;
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 2rem; /* Added margin-bottom to separate from toggle buttons */
  display: inline-flex;
  align-items: center;
  border: none;
}

.fetch-btn:hover {
  background-color: #ffa500;
}

.fetch-btn svg {
  display: inline;
  width: 1.3rem;
  height: 1.3rem;
  margin-right: 0.75rem;
  color: white;
}

/* Keyframes animation for single rotation */
@keyframes spin_357 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fetch-btn svg.rotating {
  animation: spin_357 1s linear forwards;
}

/* Extra spacer between refresh button and toggle buttons */
.spacer {
  height: 20px; /* adjust as needed */
}

/* Toggle Buttons styling */
.toggle-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
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

/* Container for the two sections */
.hof-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
  width: 100%;
  padding: 0 20px;
}

/* Column styling for each section */
.song-cards-container,
.artist-cards-container {
  width: 25%;
}
</style>
