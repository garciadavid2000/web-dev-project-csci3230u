<script setup>
defineProps({
  artistProp: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="card">
    <!-- Use the first image from the images array -->
    <img :src="artistProp.images[0]?.url" alt="Artist Image" />
    <div class="container">
      <h4><b>{{ artistProp.name }}</b></h4>
      <!-- Access followers.total for the count -->
      <p>{{ artistProp.followers.total.toLocaleString() }} followers</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  margin: 10px;
  display: inline-block;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgb(255, 255, 255);
}

.container {
  padding: 2px 16px;
}

img {
  width: 10%;
}
</style>