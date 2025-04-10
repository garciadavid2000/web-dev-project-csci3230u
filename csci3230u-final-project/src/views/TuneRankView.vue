<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue'
import SearchArtistCard from '@/components/SearchArtistCard.vue'

const topTracks = ref([])
const topArtists = ref([])
const undergroundScore = ref('?')
const loading = ref(false)
const depth = ref(5);
const timeRange = ref('short_term');
const trackPopularityList = [];
const artistPopularityList = [];

const calculateUndergroundScore = (tracks, artists) => {
  const trackPopularities = tracks.map(t => t.popularity)
  const artistPopularities = artists.map(a => a.popularity)

  const combined = [...trackPopularities, ...artistPopularities]

  if (combined.length === 0) return 0

  const avgPopularity = combined.reduce((sum, val) => sum + val, 0) / combined.length

  return Math.round(100 - avgPopularity)
}

async function getArtistIdByName(artistName) {
    try {
        const response = await SpotifyDataService.searchTracksEndpoint(artistName, 'artist');

        const artistId = response.data.artists.items[0]?.id;

        if (artistId) {
            console.log(`Artist ID for ${artistName}: ${artistId}`);
            return artistId;
        } else {
            console.log(`No artist found for name: ${artistName}`);
        }

    } catch (error) {
        console.error("Error fetching artist:", error);
    }
}

async function getTrackIdByName(trackName, artistName, albumName) {
    try {
        const response = await SpotifyDataService.searchTracksEndpoint(trackName+' '+artistName+' '+albumName, 'track');

        const trackId = response.data.tracks.items[0]?.id;

        if (trackId) {
            console.log(`Track ID for ${trackName}: ${trackId}`);
            return trackId;
        } else {
            console.log(`No track found for name: ${trackName}`);
        }
        
    } catch (error) {
        console.error("Error fetching track:", error);
    }
}

const fetchDataAndScore = async () => {
  loading.value = true
  trackPopularityList.length = 0;
  artistPopularityList.length = 0;
  undergroundScore.value = null;
  try {
    const [tracksRes, artistsRes] = await Promise.all([
      SpotifyDataService.getTopTracksEndpoint(depth.value, timeRange.value),
      SpotifyDataService.getTopArtistsEndpoint(depth.value, timeRange.value)
    ])

    for (const track of tracksRes.data.tracks) {
        try {
            // Need to manually search for track id (very consistent when using artist name, track name and album name)
            const trackId = await getTrackIdByName(track.name, track.artistsArr[0].name, track.album);

            const trackDetails = await SpotifyDataService.getTrackById(trackId);

            //Store all relevant information in array
            trackPopularityList.push({
                trackId: trackId,
                popularity: trackDetails.data.popularity,
                name: track.name,
                artist: track.artistsArr[0].name
            });

            console.log(`Track: ${track.name}, Popularity: ${trackDetails.data.popularity}`);
        } catch (error) {
            console.error(`Error fetching popularity for track: ${track.name}`, error);
        }
    }

    for (const artist of artistsRes.data) {
        try {
            // Need to manually search for artist id
            const artistId = await getArtistIdByName(artist.name);

            const artistDetails = await SpotifyDataService.getArtistById(artistId);
            console.log(artistDetails)

            //Store all relevant information in array
            artistPopularityList.push({
                artistId: artistId,
                popularity: artistDetails.data.popularity,
                name: artist.name
            });

            console.log(`Artist: ${artist.name}, Popularity: ${artistDetails.data.popularity}`);
        } catch (error) {
            console.error(`Error fetching popularity for artist: ${artist.name}`, error);
        }
    }

    undergroundScore.value = calculateUndergroundScore(trackPopularityList, artistPopularityList)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <div class="tunerank-container">
        <h1>TasteRank</h1>
        <p class="hook">Click below to see how underground your taste in music is!</p>
        <p>Select the data range and recency from the dropdowns below to customize your preferences.
        </p>

        <div class="dropdowns">
            <!-- Dropdown for selecting the depth -->
            <label for="depth">Select number of songs:</label>
            <select v-model="depth" id="depth">
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
            </select>

            <!-- Dropdown for selecting the time range -->
            <label for="timeRange">Select time range:</label>
            <select v-model="timeRange" id="timeRange">
                <option value="short_term">Short Term</option>
                <option value="medium_term">Medium Term</option>
                <option value="long_term">Long Term</option>
            </select>
        </div>
        
        <button class="rank-btn" @click="fetchDataAndScore" :disabled="loading">
            {{ loading ? 'Calculating...' : 'Calculate My Underground Score' }}
        </button>

        <div v-if="undergroundScore !== null" class="score-display">
            <p> Your Underground Music Taste Score:</p>
            <h2>🌌 {{ undergroundScore }} / 100 🌌</h2>
        </div>
        <div v-if="undergroundScore !== null" class="popularity-bar-container">
          <div class="popularity-bar">
            <div class="popularity-fill" :style="{ width: undergroundScore + '%' }"></div>
          </div>
        </div>
        <div v-if="undergroundScore == null" class="loading">
            <h2> ⚙️ Loading ⚙️ </h2>
        </div>
    </div>
</template>
  
<style scoped>
.tunerank-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background-color: #222;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  color: #fff;
}

h1 {
  font-size: 2.5rem;
  color: #2b75ff;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #ddd;
  margin-bottom: 2rem;
}

.dropdowns {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
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

.rank-btn {
  background-color: #85e2d5;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #1e1e1e;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 2rem;
}

.rank-btn:hover {
  background-color: #3460ab;
}

.score-display {
  margin-top: 2rem;
}

.score-display h2 {
  font-size: 3rem;
  color: #59d6f1;
}

.hook {
    font-size: 22px;
    font-weight: bold;
    color: #ffffff;
}

.popularity-container {
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 6px;
}

.flame {
  font-size: 20px;
  color: #c0c0c0;
  font-weight: bold;
  min-width: 100px;
}

.popularity-bar {
  flex-grow: 1;
  height: 15px;
  background-color: #7777776c;
  border-radius: 15px;
  overflow: hidden;
  margin-top: 12px;
}

.popularity-fill {
  height: 100%;
  background-color: #bcf2ff;
  transition: width 0.3s ease;
}

.loading {
  font-size: 1.5rem;
  color: #ffffff;
  margin-top: 2rem;
}
</style>