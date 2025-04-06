<script setup>
defineProps({
  cardProp: {
    type: Object,
    required: true,
  },
});

const formatDuration = (durationMs) => {
    const minutes = Math.floor(durationMs/60000);
    const seconds = Math.floor((durationMs%60000)/1000);
    return `${minutes}:${seconds<10?'0'+seconds:seconds}`;
};
</script>

<template>
    <div class="card">
        <div class="album-art">
            <img :src="cardProp.album.images[0]?.url" alt="Album Art" />
        </div>

        <div class="song-info">
            <h4 class="track-name"><b>{{ cardProp.name }}</b></h4>
            <p class="artist-name">{{ cardProp.artists[0]?.name }}</p>
            <p class="album-name">{{ cardProp.album.name }}</p>
        </div>

        <div class="duration">
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
    height: 120px;
    margin: 12px;
    background-color: #2d2d2d;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: 0.3s;
    border-radius: 10px;
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
    width: 40%;
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