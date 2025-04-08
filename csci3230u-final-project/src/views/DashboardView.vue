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
    <button @click="logout">Logout</button>
  </div>
  <h2>Listening Time Chart:</h2>
  <div id="chart"></div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import * as d3 from 'd3'

export default {
  data() {
    return {
      user: {},
      topSongs: [],
      topArtists: [],
      recentlyPlayed: [],
      totalListeningTime: [],
    }
  },
  async mounted() {
    try {
      const userResponse = await axios.get('/api/user', { withCredentials: true })
      this.user = userResponse.data
      const topTracksResponse = await axios.get('/api/top-tracks', { withCredentials: true })
      this.topSongs = topTracksResponse.data
      this.totalListeningTime = topTracksResponse.data.totalListeningTimeMinutes
      const topArtistsResponse = await axios.get('/api/top-artists', { withCredentials: true })
      this.topArtists = topArtistsResponse.data
      const recentlyPlayedResponse = await axios.get('/api/recently-played', {
        withCredentials: true,
      })
      this.recentlyPlayed = recentlyPlayedResponse.data

      // Set up the chart
      const chart = $('#chart').css('width', '100%').css('height', '400px')
      const data = this.topSongs.tracks
      const width = 300
      const height = 300
      const svg = d3
        .select(chart[0]) // JQuery object to DOM element
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)

      const color = d3
        .scaleOrdinal()
        .domain(data.map((s) => s.name))
        .range(d3.schemeSet2)

      const pie = d3.pie().value((d) => d.duration_ms)
      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(width / 2 - 10)
      const arcs = svg.selectAll('arc').data(pie(data)).enter().append('g')
      arcs
        .append('path')
        .attr('d', arc)
        .attr('fill', (d) => color(d.data.name))
        .attr('stroke', 'black')
        .style('stroke-width', '2px')
        .style('opacity', 0.7)

      arcs
        .append('text')
        .text(function (d) {
          return d.data.name
        })
        .attr('transform', function (d) {
          return 'translate(' + arc.centroid(d) + ')'
        })
        .style('text-anchor', 'middle')
        .style('font-size', 17)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },
  methods: {
    logout() {
      window.location.href = '/api/logout'
    },
  },
}
</script>
