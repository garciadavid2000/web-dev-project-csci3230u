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
    name: 'ArtistDetail',
    params: { id: cardProp.id },
    state: { artistData: cardProp }
  })
}
</script>

<template>
  <div class="card" @click="goToDetail">
    <div class="artist-art">
      <!-- Use the first image from the artist's images array -->
      <img :src="cardProp.images[0]?.url" alt="Artist Image" />
    </div>

    <div class="artist-info">
      <h4 class="artist-name"><b>{{ cardProp.name }}</b></h4>
      <p class="followers">Followers: {{ cardProp.followers.total.toLocaleString() }}</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 120px;
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

.artist-art {
  padding-left: 15px;
}

.artist-art img {
  height: 80px;
  width: 80px;
  object-fit: cover;
  border-radius: 50%; /* Circular image */
}

.artist-info {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 10px;
  width: 60%;
}

.artist-name {
  font-size: 18px;
  margin: 0;
  color: rgb(255, 115, 0);
}

.followers {
  font-size: 14px;
  margin: 2px 0;
  color: #e4e4e4;
}
</style>