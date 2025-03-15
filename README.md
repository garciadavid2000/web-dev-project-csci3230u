# web-dev-project-csci3230u
## Setup Instructions

1. **Install Dependencies**  
   Run the following command to install necessary packages:
   ```bash
   npm install
2. **Create a .env file**  
  Create a ```.env``` file in the root directory and add the following environment variables:
   ```bash
    SESSION_SECRET=your_secret_value #node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
    SPOTIFY_CLIENT_ID=your_spotify_client_id # Look at https://developer.spotify.com/documentation/web-api 
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

3. **Run the App**
```bash
    npm run dev
