require("dotenv").config();
const express = require("express");
const path = require("path");
const axios = require("axios");
const session = require("express-session");
const querystring = require("querystring");
const app = express();
const port = 3000;

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:5173", // This is because Vue and Express run on two different ports
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.set('views', path.join(__dirname, 'views'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_URL = "https://api.spotify.com/v1";

app.get("/api/login", (req, res) => {
  const params = querystring.stringify({
    client_id: process.env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    scope: "user-top-read user-read-recently-played",
  });

  res.redirect(`${SPOTIFY_AUTH_URL}?${params}`);
});

app.get("/api/callback", async (req, res) => {
  // console.log(req.query)
  // console.log(req.session)
  const code = req.query.code;
  if (!code) return res.redirect("http://localhost:5173/?error=login_failed");

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    req.session.access_token = response.data.access_token;
    // console.log(response.data)
    req.session.refresh_token = response.data.refresh_token;
    res.redirect("http://localhost:5173/dashboard");
  } catch (error) {
    console.error(
      "Error getting tokens:",
      error.response ? error.response.data : error
    );
    res.redirect("http://localhost:5173/?error=token_error");
  }
});

app.get("/api/top-tracks", async (req, res) => {
  if (!req.session.access_token) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  
  const { limit = 5, time_range = "medium_term" } = req.query; // default values if not specified
  
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me/top/tracks`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
      params: { limit, time_range },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching top tracks:", error.response ? error.response.data : error);
    res.status(500).send("Error fetching top tracks");
  }
});

// Can get top generes here
app.get("/api/top-artists", async (req, res) => {
  if (!req.session.access_token)
    return res.status(401).json({ message: "Not authenticated" });
    
  const { limit = 5, time_range = "medium_term" } = req.query; // default values if not specified
  
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/me/top/artists`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
      params: { limit, time_range },
    });
    res.json(response.data); // return the full response
  } catch (error) {
    console.error("Error fetching top artists:", error.response ? error.response.data : error);
    res.status(500).send("Error fetching top artists");
  }
});


app.get("/api/recently-played", async (req, res) => {
  if (!req.session.access_token)
    return res.status(401).json({ message: "Not authenticated" });

  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/me/player/recently-played?limit=50`,
      {
        headers: { Authorization: `Bearer ${req.session.access_token}` },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching recently played tracks:", error.response ? error.response.data : error);
    res.status(500).send("Error fetching recently played tracks");
  }
});
app.get("/api/user", async (req, res) => {
  if (!req.session.access_token) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
    });
    // console.log(response)
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// you can search for albums, artists, tracks etc.
// MUST SPECIFY TYPE: "album", "artist", "playlist", "track", "show", "episode", "audiobook"
app.get("/api/search", async (req, res) => {
  if (!req.session.access_token)
    return res.status(401).json({ message: "Not authenticated" });

  const { query, type } = req.query;
  if (!query || !type) {
    return res.status(400).json({ error: "Query and type are required" });
  }

  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
      params: {
        q: query,
        type: type,
        limit: 10,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error searching Spotify:", error);
    res.status(500).send("Error performing search");
  }
});

//get song information by track id
app.get("/api/track/:id", async (req, res) => {
  const trackId = req.params.id;
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/tracks/${trackId}`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching track by ID:", error);
    res.status(500).json({ error: "Failed to fetch track details" });
  }
});

//get artist information by artist id
app.get("/api/artist/:id", async (req, res) => {
  const artistId = req.params.id;
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/artists/${artistId}`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching artist by ID:", error);
    res.status(500).json({ error: "Failed to fetch artist details" });
  }
});

app.get("/api/artists", async (req, res) => {
  const artistIds = req.query.ids;
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/artists`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
      params: { ids: artistIds },
    });
    res.json(response.data.artists);
  } catch (error) {
    console.error("Error fetching artist by ID:", error);
    res.status(500).json({ error: "Failed to fetch artist details" });
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: req.app.get("env") === "development" ? err : {},
  });
});

app.get("/api/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    res.redirect("http://localhost:5173/");
  });
});

app.get("/api/artist/:id/top-tracks", async (req, res) => {
  const artistId = req.params.id;
  // The market parameter is required by Spotify's API I left as US by default
  const market = req.query.market || "US";
  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/artists/${artistId}/top-tracks`,
      {
        headers: { Authorization: `Bearer ${req.session.access_token}` },
        params: { market },
      }
    );
    // Return the complete data, or process it if needed
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching artist top tracks:",
      error.response ? error.response.data : error
    );
    res.status(500).json({ error: "Failed to fetch artist top tracks" });
  }
});

app.get("/api/album/:id", async (req, res) => {
  const albumId = req.params.id;
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/albums/${albumId}`, {
      headers: { Authorization: `Bearer ${req.session.access_token}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching album by ID:",
      error.response ? error.response.data : error
    );
    res.status(500).json({ error: "Failed to fetch album details" });
  }
});

app.get("/api/album/:id/tracks", async (req, res) => {
  const albumId = req.params.id;
  const { limit = 20, offset = 0, market = "US" } = req.query;
  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/albums/${albumId}/tracks`,
      {
        headers: { Authorization: `Bearer ${req.session.access_token}` },
        params: { limit, offset, market },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching album tracks:",
      error.response ? error.response.data : error
    );
    res.status(500).json({ error: "Failed to fetch album tracks" });
  }
});

app.get("/api/artist/:id/albums", async (req, res) => {
  const artistId = req.params.id;
  // You can also accept query parameters for limit, market, and include_groups
  const { limit = 5, market = "US", include_groups = "album" } = req.query;

  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/artists/${artistId}/albums`,
      {
        headers: { Authorization: `Bearer ${req.session.access_token}` },
        params: { limit, market, include_groups },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching artist albums:",
      error.response ? error.response.data : error
    );
    res.status(500).json({ error: "Failed to fetch artist albums" });
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`App is listening on port: ${port}, http://localhost:${port}`);
});
