require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const session = require('express-session');
const querystring = require('querystring');
const app = express();
const port = 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.set('views', path.join(__dirname, 'views')); 

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/login", (req, res) => {
    const params = querystring.stringify({
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        scope: "user-top-read"
    });

    res.redirect(`${SPOTIFY_AUTH_URL}?${params}`);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.send("Error: No code received");

    try {
        const response = await axios.post(SPOTIFY_TOKEN_URL, querystring.stringify({
            grant_type: "authorization_code",
            code,
            redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
            client_id: process.env.SPOTIFY_CLIENT_ID,
            client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        req.session.accessToken = response.data.access_token;
        res.redirect("/top-tracks");
    } catch (error) {
        res.send("Error fetching token");
    }
});

// Step 3: Fetch user's top 5 songs
app.get("/top-tracks", async (req, res) => {
    if (!req.session.accessToken) return res.redirect("/login");

    try {
        const response = await axios.get(`${SPOTIFY_API_URL}/me/top/tracks?limit=5`, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` }
        });

        res.send(response.data.items.map(track => track.name));
    } catch (error) {
        res.send("Error fetching top tracks");
    }
});

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
        error: req.app.get("env") === "development" ? err : {},
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to destroy session');
        }
        res.redirect('/');
    });
});

app.listen(process.env.PORT || port, () => {
    console.log(`App is listening on port: ${port}, http://localhost:${port}`)
});