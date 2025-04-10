<script setup>
import { useRouter } from 'vue-router'

const { cardProp } = defineProps({
  cardProp: {
    type: Object,
    required: true,
  },
});

const router = useRouter()

const goToDetail = () => {
  router.push({
    name: 'AlbumDetail',
    params: { id: cardProp.id },
    state: { albumData: cardProp }
  })
}
</script>

<template>
  <div class="card" @click="goToDetail">
    <div class="album-art">
      <img :src="cardProp.images[0].url" alt="Album Cover" />
    </div>

    <div class="album-info">
      <h4 class="album-name"><b>{{ cardProp.name }}</b></h4>
      <p class="artist-name">{{ cardProp.artists[0].name }}</p>
      <p class="release-date">Released: {{ cardProp.release_date }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: auto;
  min-height: 120px;
  margin: 12px;
  background-color: #2d2d2d;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  border-radius: 10px;
  cursor: pointer;
}

.card:hover {
  box-shadow: 0 0 16px 4px rgb(255, 115, 0);
}

.album-art {
  padding-left: 15px;
}

.album-art img {
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: 15px;
}

.album-info {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 10px;
  width: 60%;
}

.album-name {
  font-size: 18px;
  margin: 0;
  color: rgb(255, 115, 0);
}

.artist-name {
  font-size: 14px;
  margin: 2px 0;
  color: #e4e4e4;
}

.release-date {
  font-size: 14px;
  margin: 2px 0;
  color: #9e9e9e;
}
</style>
