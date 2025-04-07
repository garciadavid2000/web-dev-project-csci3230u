<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue' // used for tracks (cardType="song")
import SearchArtistCard from '@/components/SearchArtistCard.vue' // used for artist detail (if needed)

const route = useRoute()
const artistId = route.params.id
const artist = ref(null)
const topTracks = ref([])
const recentAlbums = ref([])

onMounted(async () => {//Had to comment this because it kept getting too complicated
  try {

    const artistResponse = await SpotifyDataService.getArtistById(artistId)
    artist.value = artistResponse.data

    // Fetch the artist's top tracks (assume .tracks exists in response)
    const topTracksResponse = await SpotifyDataService.getArtistTopTracks(artistId)
    // Limit to top 5 tracks (as returned by the API)
    topTracks.value = topTracksResponse.data.tracks.slice(0, 5)

    // Fetch the artist's albums (recent ones)
    const albumsResponse = await SpotifyDataService.getArtistAlbums(artistId)
    // sort by release_date descending if needed
    recentAlbums.value = albumsResponse.data.items.sort((a, b) => {
      // Compare release_date strings; adjust parsing as needed if precision is not 'day'
      return new Date(b.release_date) - new Date(a.release_date)
    }).slice(0, 5)
  } catch (error) {
    console.error("Error loading artist details, top tracks, or recent albums:", error)
  }
})

</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-card">
      <div class="artist-info-section">
        <img :src="artist?.images?.[0]?.url" alt="Artist Image" class="artist-image" />
        <h2 class="artist-name">{{ artist?.name }}</h2>
        <p class="artist-meta">Followers: {{ artist?.followers?.total?.toLocaleString() }}</p>
      </div>
      <div class="columns-section">
        <div class="tracks-column">
          <h2>Top 5 Tracks</h2>
          <div class="tracks-list">
            <SearchSongCard
              v-for="track in topTracks"
              :key="track.id"
              :cardProp="track"
              cardType="song"
            />
          </div>
        </div>
        <div class="albums-column">
          <h2>Recent Albums</h2>
          <div class="albums-list">
            <SearchSongCard
              v-for="album in recentAlbums"
              :key="album.id"
              :cardProp="album"
              cardType="album"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-wrapper {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
}

.detail-card {
  background-color: #2d2d2d;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  padding: 24px;
}

.artist-info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  border-bottom: 2px solid #444;
  padding-bottom: 24px;
}
.artist-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.artist-name {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #ffa500;
  text-align: center;
}
.artist-meta {
  font-size: 16px;
  color: #ccc;
  margin-top: 8px;
  text-align: center;
}

.columns-section {
  display: flex;
  gap: 20px;
  justify-content: space-evenly;
}

.tracks-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.tracks-column h2 {
  color: #ffa500;
  margin-bottom: 12px;
}
.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.albums-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.albums-column h2 {
  color: #ffa500;
  margin-bottom: 12px;
}
.albums-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
