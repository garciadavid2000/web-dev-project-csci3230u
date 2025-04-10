<template>
  <div id="dashboardContainer">
    <h1 class="welcome">Welcome, {{ user.display_name }}</h1>
    <div id="dashboard">
      <div id="userInfo">
        <h2>Your Top 5 Songs:</h2>
        <div v-if="topSongs" class="song-cards-container">
          <h2>Your Top Songs:</h2>
          <SearchSongCard
            v-for="song in topSongs"
            :key="song.track_id"
            :cardProp="song"
            cardType="song"
          />
        </div>
        
        <ul>
          <li v-for="song in topSongs" :key="song.id">{{ song.name }}, by {{ song.artist }}</li>
        </ul>
        <h2>Total Listening Time: {{ totalListeningTime }} minutes</h2>
        <h2>Your Top 5 Artists:</h2>
        <ul>
          <li v-for="artist in topArtists" :key="artist">{{ artist }}</li>
        </ul>
        <h2>Recently Played Tracks:</h2>
        <ul>
          <li v-for="song in recentlyPlayed" :key="song.id">{{ song.name }}, by {{ song.artist }}</li>
        </ul>
        <button @click="logout">Logout</button>
      </div>
      <div id="chartContainer">
        <h2>Data Visualizations:</h2>
        <div id="sourceButtons">
          <button class="sourceButton active">Recent</button>
          <button class="sourceButton">Top</button>
        </div>
        <div id="chartButtons">
          <button class="chartButton active">Albums</button>
          <button class="chartButton">Artists</button>
          <button class="chartButton">Genres</button>
        </div>
        <div id="chartWrapper">
          <div id="chart"></div>
          <div id="legend"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
import * as d3 from 'd3'
import SearchSongCard from '@/components/SearchSongCard.vue';
import SpotifyDataService from '@/services/SpotifyDataService.js';

export default {
  name: 'DashboardView',
  // Register the component here:
  components: {
    SearchSongCard,
  },
  data() {
    return {
      user: {},
      topSongs: [],
      topArtists: [],
      recentlyPlayed: [],
      totalListeningTime: 0,  // Use a number since this is minutes
    }
  },
  async mounted() {
  try {
    // Fetch user data using service method
    const userResponse = await SpotifyDataService.getUserEndpoint()
    this.user = userResponse.data

    // Fetch top tracks (limit = 5, time_range = 'short_term') using service method
    const topTracksResponse = await SpotifyDataService.getTopTracksEndpoint(5, 'short_term')
    this.topSongs = topTracksResponse.data.tracks
    console.log('Top Songs:', this.topSongs[0].images)
    this.totalListeningTime = topTracksResponse.data.totalListeningTimeMinutes

    // Fetch top artists (limit = 5, time_range = 'short_term') using service method
    const topArtistsResponse = await SpotifyDataService.getTopArtistsEndpoint(5, 'short_term')
    this.topArtists = topArtistsResponse.data

    // Fetch recently played tracks using service method
    const recentlyPlayedResponse = await SpotifyDataService.getRecentlyPlayedTracksEndpoint()
    this.recentlyPlayed = recentlyPlayedResponse.data

    
    // --- Chart Buttons & Rendering (Legacy jQuery-based logic) ---
    let dataSource = 'recent'
    let dataType = 'albums'
    const vm = this // preserve component context

    $('.sourceButton').click(function () {
      if ($(this).hasClass('active')) return
      $('.sourceButton').removeClass('active')
      $(this).addClass('active')
      dataSource = $(this).text() === 'Recent' ? 'recent' : 'top'
      const data = vm.getChartData(dataSource, dataType)
      vm.updateChart(data)
    })
    $('.chartButton').click(function () {
      if ($(this).hasClass('active')) return
      $('.chartButton').removeClass('active')
      $(this).addClass('active')
      if ($(this).text() === 'Albums') {
        dataType = 'albums'
      } else if ($(this).text() === 'Artists') {
        dataType = 'artists'
      } else if ($(this).text() === 'Genres') {
        dataType = 'genres'
      }
      const data = vm.getChartData(dataSource, dataType)
      vm.updateChart(data)
    })
    const chartData = this.getChartData(dataSource, dataType)
    this.updateChart(chartData)
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
,
  methods: {
    logout() {
      window.location.href = '/api/logout'
    },
    getChartData(source, type) {
      const data = source === 'recent' ? this.recentlyPlayed : this.topSongs
      if (type === 'albums') {
        let albums = {}
        data.forEach((track) => {
          // Use track.album.name if available (adjust to your data structure)
          const albumName = track.album?.name || track.album
          albums[albumName] = (albums[albumName] || 0) + 1
        })
        let albumData = []
        for (const [key, value] of Object.entries(albums)) {
          albumData.push({ name: key, value: value })
        }
        return albumData
      } else if (type === 'artists') {
        let artists = {}
        data.forEach((track) => {
          track.artistsArr.forEach((artist) => {
            const name = artist.name.trim()
            artists[name] = (artists[name] || 0) + 1
          })
        })
        let artistData = []
        for (const [key, value] of Object.entries(artists)) {
          artistData.push({ name: key, value: value })
        }
        return artistData
      } else if (type === 'genres') {
        let genres = {}
        data.forEach((track) => {
          track.artistsArr.forEach((artist) => {
            artist.genres.forEach((genre) => {
              genre = genre.trim()
              genres[genre] = (genres[genre] || 0) + 1
            })
          })
        })
        let genreData = []
        for (const [key, value] of Object.entries(genres)) {
          genreData.push({ name: key, value: value })
        }
        return genreData
      } else {
        console.error('Invalid chart type:', type)
        return []
      }
    },
    updateChart(data) {
      // Clear the chart before drawing a new one
      $('#chart').empty()
      $('#legend').empty()
      if (data.length === 0) {
        $('#chart').append('<p>No data available</p>')
        return
      }
      const chart = $('#chart').css('width', '100%').css('height', '400px')
      const width = 300
      const height = 300
      const svg = d3
        .select(chart[0])
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`)

      const color = d3
        .scaleOrdinal()
        .domain(data.map((s) => s.name))
        .range(d3.schemeSet2)

      const pie = d3.pie().value((d) => d.value)
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

      const total = data.reduce((acc, d) => acc + d.value, 0)
      arcs
        .append('text')
        .text(function (d) {
          const fraction = d.data.value / total
          return fraction > 0.05 ? Math.round(fraction * 100) + '%' : ''
        })
        .attr('transform', function (d) {
          return 'translate(' + arc.centroid(d) + ')'
        })
        .style('text-anchor', 'middle')
        .style('font-size', 17)

      const legendRectSize = 18
      const legendSpacing = 4
      const legendEl = $('#legend')[0]
      const legend = d3
        .select(legendEl)
        .append('svg')
        .attr('width', 200)
        .attr('height', data.length * 25)
        .selectAll('legendItems')
        .data(data.map((d) => d.name))
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          const y = i * (legendRectSize + legendSpacing)
          return `translate(0, ${y})`
        })

      legend
        .append('rect')
        .attr('width', legendRectSize)
        .attr('height', legendRectSize)
        .style('fill', color)
        .style('stroke', color)

      legend
        .append('text')
        .attr('x', legendRectSize + 5)
        .attr('y', legendRectSize - 4)
        .text((d) => d)
        .style('font-size', '14px')
    },
  },
}
</script>

<style scoped src="../assets/dashboard.css"></style>
