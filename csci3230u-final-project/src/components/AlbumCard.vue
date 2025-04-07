<script setup>
defineProps({
  albumProp: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card album-card">
    <!-- Use the first image from the album's images array -->
    <img :src="albumProp.images[0]?.url" alt="Album Cover" />
    <div class="container">
      <h4><b>{{ albumProp.name }}</b></h4>
      <!-- Display the first artist's name -->
      <p>{{ albumProp.artists[0]?.name }}</p>
      <!-- Optionally, display the release date -->
      <p>{{ albumProp.release_date }}</p>
    </div>
  </div>
</template>

<style scoped>
.card.album-card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 10px;
  display: inline-block;
}

.card.album-card:hover {
  box-shadow: 0 8px 16px 0 rgb(255, 255, 255);
}

.container {
  padding: 2px 16px;
}

img {
  width: 10%;
}
</style>