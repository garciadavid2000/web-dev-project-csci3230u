require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const querystring = require('querystring');
const app = express();
const port = 3000;

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', // This is because Vue and Express run on two different ports
    credentials: true
}));

app.use(express.urlencoded({extended: true}));
app.use(express.json());
// app.set('views', path.join(__dirname, 'views')); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

app.get("/api/login", (req, res) => {
    const params = querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI, 
        scope: "user-top-read user-read-recently-played" 
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
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );
        req.session.access_token = response.data.access_token;
        // console.log(response.data)
        req.session.refresh_token = response.data.refresh_token;
        res.redirect("http://localhost:5173/dashboard"); 
    } catch (error) {
        console.error("Error getting tokens:", error.response ? error.response.data : error);
        res.redirect("http://localhost:5173/?error=token_error");
    }
});

app.get("/api/top-tracks", async (req, res) => {
    if (!req.session.access_token) return res.redirect("/login");

    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me/top/tracks?limit=5`, {
            headers: { Authorization: `Bearer ${req.session.access_token}` }
        });

        // console.log(response.data.items)
        const tracks = response.data.items.map(track => ({
            name: track.name, 
            album: track.album.name, 
            artist: track.artists.map(artist => artist.name).join(", "), 
            image: track.album.images[0]?.url,
            duration_ms: track.duration_ms 
        }));
        const totalListeningTimeMs = tracks.reduce((sum, track) => sum + track.duration_ms, 0);
        const totalListeningTimeMinutes = (totalListeningTimeMs / 60000).toFixed(2);
        res.json({tracks, totalListeningTimeMinutes})
    } catch (error) {
        res.send("Error fetching top tracks");
    }
});

app.get("/api/top-artists", async (req, res) => {
    if (!req.session.access_token) return res.redirect("/login");

    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me/top/artists?limit=5`, {
            headers: { Authorization: `Bearer ${req.session.access_token}` }
        });

        const artists = response.data.items.map(artist => ({
            name: artist.name, 
            genres: artist.genres.join(", "), 
            image: artist.images[0]?.url 
        }));

        res.json(artists);
    } catch (error) {
        res.send("Error fetching top artists");
    }
});

app.get("/api/recently-played", async (req, res) => {
    if (!req.session.access_token) return res.redirect("/login");

    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me/player/recently-played?limit=5`, {
            headers: { Authorization: `Bearer ${req.session.access_token}` }
        });
        
        console.log(response.data.items)
        const tracks = response.data.items.map(track => ({
            name: track.track.name,
            album: track.track.album.name, 
            artist: track.track.artists.map(artist => artist.name).join(", "), 
            image: track.track.album.images[0]?.url 
        }));
        res.json(tracks);
    } catch (error) {
        res.send("Error fetching recently played tracks");
    }
});
app.get('/api/user', async (req, res) => {
    if (!req.session.access_token) {
        return res.status(401).json({ error: "Not logged in" });
    }

    try {
        const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: { Authorization: `Bearer ${req.session.access_token}` }
        });
        // console.log(response)
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: req.app.get("env") === "development" ? err : {},
    });
});

app.get('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.redirect('http://localhost:5173/');
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`App is listening on port: ${port}, http://localhost:${port}`)
});