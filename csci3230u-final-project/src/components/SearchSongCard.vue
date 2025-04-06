<script setup>
defineProps({
  cardProp: {
    type: Object,
    required: true,
  },
});
</script>

<template>
    <div class="card">
      <img :src="cardProp.image" alt="Album Art" />
      <div class="container">
        <h4><b>{{ cardProp.name }}</b></h4>
        <p>{{ cardProp.artist }}</p>
        <p>{{ cardProp.album }}</p>
      </div>
    </div>
</template>

<style scoped>
.card {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  width: 40%;
  margin: 10px;
  display: inline-block;
}

.card:hover {
  box-shadow: 0 8px 16px 0 rgb(78, 175, 214);
}

.container {
  padding: 2px 16px;
}

img {
  width: 10%;
}

</style>