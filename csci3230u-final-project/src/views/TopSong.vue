<script>
import axios from 'axios';

export default {
    // name: "TopSong",
    data() {
        return {
            topSongs: [],
        };
    },
    
    async mounted() {
        try {
        const topTracksResponse = await axios.get('/api/top-tracks', { withCredentials: true });
        this.topSongs = topTracksResponse.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },

    methods: {

    },
    computed: {

    },
};

</script>

<template>
    <div class="top-song">
        <img v-bind:src="topSongs.tracks[0]?.image" alt="top-song" width="125" height="125" />
        <h1>{{ topSongs.tracks[0].name }}</h1>
    </div>
</template>



<style scoped>
.top-song {

}
</style>