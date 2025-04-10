<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  cardProp: {
    type: Object,
    required: true,
  },
  cardType: {
    type: String,
    required: true, // "song" or "album"
  }
});

const router = useRouter();

const formatDuration = (durationMs) => {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
};

const goToDetail = () => {
  if (props.cardType === 'song') {
    router.push({
      name: 'SongDetail',
      params: { id: props.cardProp.id },
      state: { songData: props.cardProp }
    });
  } else if (props.cardType === 'album') {
    router.push({
      name: 'AlbumDetail',
      params: { id: props.cardProp.id },
      state: { albumData: props.cardProp }
    });
  }
};
</script>

<template>
  <div class="card" @click="goToDetail">
    <div class="album-art">
      <img
        :src="cardType === 'song' ? cardProp.album?.images?.[0]?.url : cardProp.images?.[0]?.url"
        alt="Image"
      />
    </div>

    <div class="song-info">
      <h4 class="track-name"><b>{{ cardProp.name }}</b></h4>
      <template v-if="cardType === 'song'">
        <p class="artist-name">{{ cardProp.artists[0]?.name }}</p>
        <p class="album-name">{{ cardProp.album.name }}</p>
      </template>
      <template v-else-if="cardType === 'album'">
        <p class="artist-name">{{ cardProp.artists[0]?.name }}</p>
        <p class="album-name">Released: {{ cardProp.release_date }}</p>
      </template>
    </div>

    <div class="duration" v-if="cardType === 'song'">
      <p>{{ formatDuration(cardProp.duration_ms) }}</p>
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
  object-fit: contain;
  border-radius: 15px;
}
.song-info {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 10px;
  width: 70%;
}
.track-name {
  font-size: 18px;
  margin: 0;
  color: rgb(255, 115, 0);
}
.artist-name {
  font-size: 14px;
  margin: 2px 0;
  color: #e4e4e4;
}
.album-name {
  font-size: 14px;
  margin: 2px 0;
  color: #9e9e9e;
}
.duration {
  font-size: 14px;
  color: #e4e4e4;
  text-align: right;
  width: 15%;
  padding-right: 15px;
}
</style>
