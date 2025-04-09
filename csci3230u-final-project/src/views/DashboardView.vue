<template>
  <div id="dashboardContainer">
    <h1 class="welcome">Welcome, {{ user.display_name }}</h1>
    <div id="dashboard">
      <div id="userInfo">
        <h2>Your Top 5 Songs:</h2>
        <ul>
          <li v-for="song in topSongs" :key="song">{{ song.name }}, by {{ song.artist }}</li>
        </ul>
        <h2>Total Listening Time: {{ totalListeningTime }} minutes</h2>
        <h2>Your Top 5 Artists:</h2>
        <ul>
          <li v-for="artist in topArtists" :key="artist">{{ artist }}</li>
        </ul>
        <h2>Recently Played Tracks:</h2>
        <ul>
          <li v-for="song in recentlyPlayed" :key="song">{{ song.name }}, by {{ song.artist }}</li>
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
      this.topSongs = topTracksResponse.data.tracks
      this.totalListeningTime = topTracksResponse.data.totalListeningTimeMinutes
      const topArtistsResponse = await axios.get('/api/top-artists', { withCredentials: true })
      this.topArtists = topArtistsResponse.data
      const recentlyPlayedResponse = await axios.get('/api/recently-played', {
        withCredentials: true,
      })
      this.recentlyPlayed = recentlyPlayedResponse.data

      const recentArtistIds = Array.from(
        new Set(this.recentlyPlayed.map((track) => track.artistsArr.map((artist) => artist.id))),
      )
      // Get full artist data
      const recentArtistsArr = (
        await axios.get('/api/artists', {
          withCredentials: true,
          params: {
            ids: recentArtistIds.join(','),
          },
        })
      ).data
      const recentArtistsMap = {}
      recentArtistsArr.forEach((artist) => {
        recentArtistsMap[artist.id] = artist
      })
      // Map the artist data to the tracks
      this.recentlyPlayed = this.recentlyPlayed.map((track) => {
        track.artistsArr = track.artistsArr.map((artist) => {
          const fullArtist = recentArtistsMap[artist.id]
          return {
            ...artist,
            genres: fullArtist ? fullArtist.genres : [],
          }
        })
        return track
      })

      // get full authors for top songs
      const topArtistIds = Array.from(
        new Set(this.topSongs.map((track) => track.artistsArr.map((artist) => artist.id))),
      )

      // Get full artist data
      const topArtistsArr = (
        await axios.get('/api/artists', {
          withCredentials: true,
          params: {
            ids: topArtistIds.join(','),
          },
        })
      ).data

      const topArtistsMap = {}
      topArtistsArr.forEach((artist) => {
        topArtistsMap[artist.id] = artist
      })

      // Map the artist data to the tracks
      this.topSongs = this.topSongs.map((track) => {
        track.artistsArr = track.artistsArr.map((artist) => {
          const fullArtist = topArtistsMap[artist.id]
          return {
            ...artist,
            genres: fullArtist ? fullArtist.genres : [],
          }
        })
        return track
      })

      let dataSource = 'recent'
      let dataType = 'albums'
      const vm = this // keep track of component context

      $('.sourceButton').click(function () {
        // Do nothing if already active
        if ($(this).hasClass('active')) {
          return
        }
        $('.sourceButton').removeClass('active')
        $(this).addClass('active')
        // Assign data based on the button clicked
        if ($(this).text() === 'Recent') {
          dataSource = 'recent'
        } else if ($(this).text() === 'Top') {
          dataSource = 'top'
        }
        const data = vm.getChartData(dataSource, dataType)
        vm.updateChart(data)
      })
      $('.chartButton').click(function () {
        // Do nothing if already active
        if ($(this).hasClass('active')) {
          return
        }
        $('.chartButton').removeClass('active')
        $(this).addClass('active')
        // Assign data based on the button clicked
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
  },
  methods: {
    logout() {
      window.location.href = '/api/logout'
    },
    getChartData(source, type) {
      const data = source === 'recent' ? this.recentlyPlayed : this.topSongs
      if (type === 'albums') {
        let albums = {}
        data.forEach((track) => {
          // Increment or assign 1
          albums[track.album] = (albums[track.album] || 0) + 1
        })
        // Convert to array of objects
        let albumData = []
        for (const [key, value] of Object.entries(albums)) {
          albumData.push({ name: key, value: value })
        }
        return albumData
      } else if (type === 'artists') {
        let artists = {}
        data.forEach((track) => {
          // Increment or assign 1 for each artist
          track.artistsArr.forEach((artist) => {
            artist = artist.name.trim()
            artists[artist] = (artists[artist] || 0) + 1
          })
        })
        // Convert to array of objects
        let artistData = []
        for (const [key, value] of Object.entries(artists)) {
          artistData.push({ name: key, value: value })
        }
        return artistData
      } else if (type === 'genres') {
        let genres = {}
        data.forEach((track) => {
          // Increment or assign 1 for each genre
          track.artistsArr.forEach((artist) => {
            console.log(artist)
            artist.genres.forEach((genre) => {
              genre = genre.trim()
              genres[genre] = (genres[genre] || 0) + 1
            })
          })
        })
        // Convert to array of objects
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
      // Set up the chart
      const chart = $('#chart').css('width', '100%').css('height', '400px')
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

      // show percentage on each slice
      const total = data.reduce((acc, d) => acc + d.value, 0)
      arcs
        .append('text')
        .text(function (d) {
          const fraction = d.data.value / total
          // avoiding adding text to slices that are too small
          return fraction > 0.05 ? Math.round(fraction * 100) + '%' : ''
        })
        .attr('transform', function (d) {
          return 'translate(' + arc.centroid(d) + ')'
        })
        .style('text-anchor', 'middle')
        .style('font-size', 17)

      // Add legend
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
