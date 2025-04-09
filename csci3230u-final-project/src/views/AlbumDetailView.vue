<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import SpotifyDataService from '@/services/SpotifyDataService.js'
import SearchSongCard from '@/components/SearchSongCard.vue'
import SearchArtistCard from '@/components/SearchArtistCard.vue'

const route = useRoute()
const albumId = route.params.id

const album = ref(null)
const albumTracks = ref([])
const albumArtists = ref([])

onMounted(async () => {
  try {
    const albumResponse = await SpotifyDataService.getAlbumById(albumId)
    album.value = albumResponse.data

    const tracksResponse = await SpotifyDataService.getAlbumTracks(albumId)
    albumTracks.value = tracksResponse.data.items.map(track => ({
      ...track,
      album: album.value
    }))

    if (album.value.artists && album.value.artists.length > 0) {
      const artistPromises = album.value.artists.map(artist =>
        SpotifyDataService.getArtistById(artist.id)
      )
      const artistResponses = await Promise.all(artistPromises)
      albumArtists.value = artistResponses.map(resp => resp.data)
    }
  } catch (error) {
    console.error("Error loading album details or tracks:", error)
  }
})
</script>

<template>
  <div class="detail-wrapper">
    <div class="detail-card">
      <div class="album-section">
        <img :src="album?.images[0]?.url" alt="Album Cover" class="album-image" />
        <h2 class="album-name">{{ album?.name }}</h2>
        <p class="album-meta">Released: {{ album?.release_date }}</p>
        <div v-if="albumArtists.length" class="artist-cards-wrapper">
          <h3>Artists</h3>
          <div class="artist-cards-list">
            <SearchArtistCard
              v-for="artist in albumArtists"
              :key="artist.id"
              :cardProp="artist"
              cardType="artist"
            />
          </div>
        </div>
      </div>
      <div class="tracks-section">
        <h2>Tracks</h2>
        <div class="tracks-list">
          <SearchSongCard
            v-for="track in albumTracks"
            :key="track.id"
            :cardProp="track"
            cardType="song"
          />
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
  display: flex;
  background-color: #232323;
  border-radius: 12px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.album-section {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 2px solid #444;
}
.album-image {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.album-name {
  margin-top: 20px;
  font-size: 22px;
  font-weight: bold;
  color: #ffa500;
  text-align: center;
}
.album-meta {
  font-size: 16px;
  color: #ccc;
  margin-top: 8px;
  text-align: center;
}
.artist-cards-wrapper {
  margin-top: 20px;
  width: 100%;
}
.artist-cards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tracks-section {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.tracks-section h2 {
  align-self: center;
  color: #ffa500;
  margin-bottom: 12px;
}
.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
