import axios from 'axios';

// Single Axios instance for our app.
const apiClient = axios.create({
  // The base URL for all API calls to use.
  baseURL: '/api',
  // credentials are not included in the request
  // This is useful for cross-origin requests where credentials are not needed.
  withCredentials: true,
  // headers are set to accept and send JSON data
  // headers: {
  //   // The 'Accept' header indicates the type of content the client can process.
  //   Accept: 'application/json',
  //   // The 'Content-Type' header indicates the type of content being sent to the server.
  //   'Content-Type': 'application/json',
  // }
})

// Main value that will be exported when this file is imported elsewhere.
// This is an Object that contains our method getUserEndpoint.
// Any module that imports this file using the default import syntax will get this object.

export default {
  
  // Export method to get user data
  getUserEndpoint() {
    return apiClient.get('/user')
  },
  
  getTopTracksEndpoint() {
    return apiClient.get('/top-tracks')
  },

  getTopArtistsEndpoint() {
    return apiClient.get('/top-artists')
  },

  getRecentlyPlayedTracksEndpoint() {
    return apiClient.get('/recently-played')
  },

  searchTracksEndpoint(query) {
    return apiClient.get('/search', {
      params: {
        query: query,
        type: 'track'
      }
    });
  },

  getTrackById(id) {
    return apiClient.get(`/track/${id}`);
  },

  getArtistById(id) {
    return apiClient.get(`/artist/${id}`);
  }
}
