<template>
    <div>
      <h1>Welcome, {{ user.display_name }}</h1>
      <h2>Your Top 5 Songs:</h2>
      <ul>
        <li v-for="song in topSongs" :key="song">{{ song }}</li>
      </ul>
      <h2>Total Listening Time: {{ totalListeningTime }} minutes</h2>
      <h2>Your Top 5 Artists:</h2>
      <ul>
        <li v-for="artist in topArtists" :key="artist">{{ artist }}</li>
      </ul>
      <h2>Recently Played Tracks:</h2>
      <ul>
        <li v-for="track in recentlyPlayed" :key="track">{{ track }}</li>
      </ul>
      <!-- ^ doesn't work yet -->
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {},
        topSongs: [],
        topArtists: [],
        recentlyPlayed: [],
        totalListeningTime:[]
      };
    },
    async mounted() {
      try {
        const userResponse = await axios.get('/api/user', { withCredentials: true });
        this.user = userResponse.data;
        const topTracksResponse = await axios.get('/api/top-tracks', { withCredentials: true });
        this.topSongs = topTracksResponse.data;
        this.totalListeningTime = topTracksResponse.data.totalListeningTimeMinutes;
        const topArtistsResponse = await axios.get('/api/top-artists', {withCredentials: true});
        this.topArtists = topArtistsResponse.data;
        const recentlyPlayedResponse = await axios.get('/api/recently-played', {withCredentials: true});
        this.recentlyPlayed = recentlyPlayedResponse.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    },
    methods: {
      logout() {
        window.location.href = "/api/logout";
      }
    }
  };
  </script>
  