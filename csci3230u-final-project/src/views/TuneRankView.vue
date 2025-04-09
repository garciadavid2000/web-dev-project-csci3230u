<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue'
import SearchArtistCard from '@/components/SearchArtistCard.vue'

const topTracks = ref([])
const topArtists = ref([])
const undergroundScore = ref(null)
const loading = ref(false)
const trackPopularityList = [];
const artistPopularityList = [];

const calculateUndergroundScore = (tracks, artists) => {
  const trackPopularities = tracks.map(t => t.popularity)
  const artistPopularities = artists.map(a => a.popularity)

  const combined = [...trackPopularities, ...artistPopularities]
  if (combined.length === 0) return 0

  const avgPopularity = combined.reduce((sum, val) => sum+val, 0) / combined.length
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
  try {
    const [tracksRes, artistsRes] = await Promise.all([
      SpotifyDataService.getTopTracksEndpoint(),
      SpotifyDataService.getTopArtistsEndpoint()
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

    console.log(artistsRes)

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

    //undergroundScore.value = calculateUndergroundScore(topTracks.value, topArtists.value)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <div class="tunerank-container">
        <h1>TuneRank</h1>
        <p>Click below to see how underground your music taste is 🎧</p>
        
        <button class="rank-btn" @click="fetchDataAndScore" :disabled="loading">
            {{ loading ? 'Calculating...' : 'Calculate My Underground Score' }}
        </button>

        <div v-if="undergroundScore !== null" class="score-display">
            <p>Your Underground Score:</p>
            <h2>{{ undergroundScore }} / 100</h2>
        </div>
    </div>
</template>
  
<style scoped>
.tunerank-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.rank-btn {
  background-color: #ffa500;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #1e1e1e;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.rank-btn:hover {
  background-color: #ff8c00;
}

.score-display {
  margin-top: 2rem;
}

.score-display h2 {
  font-size: 3rem;
  color: #ffa500;
}
</style>