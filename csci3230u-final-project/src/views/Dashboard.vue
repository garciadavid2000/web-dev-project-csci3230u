<template>
    <div>
      <h1>Welcome, {{ user.display_name }}</h1>
      <h2>Your Top 5 Songs:</h2>
      <ul>
        <li v-for="song in topSongs" :key="song">{{ song }}</li>
      </ul>
      <button @click="logout">Logout</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {},
        topSongs: []
      };
    },
    async mounted() {
      try {
        const userResponse = await axios.get('/api/user', { withCredentials: true });
        this.user = userResponse.data;
        const topTracksResponse = await axios.get('/api/top-tracks', { withCredentials: true });
        this.topSongs = topTracksResponse.data;
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
  