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
// This is an Object that contains our method getGraphicCards.
// Any module that imports this file using the default import syntax will get this object.
export default {
  // Export method to get graphics cards
  getUserEndpoint() {
    // Added onto baseURL
    return apiClient.get('/user')
  },
  
  getTopTracksEndpoint() {
    // Added onto baseURL
    return apiClient.get('/top-tracks')
  },

  getTopArtistsEndpoints() {
    // Added onto baseURL
    return apiClient.get('/top-artists')
  },

  getRecentlyPlayedTracksEndpoint() {
    // Added onto baseURL
    return apiClient.get('/recently-played')
  },


}
