# web-dev-project-csci3230u
## Setup Instructions

### 1. Setting up the Spotify App
First, make sure you have a Spotify account. Sign in to https://developer.spotify.com and click on the dashboard, and create an app. Give it any name and description you want 
**but make sure the Redirect URL is set to: ```http://localhost:3000/api/callback```.** Web API is going to be used. Click on save. 

### 2. Setting up the .env file
Create a .env in the ```/backend``` folder and add the following environment variables:
   ```bash
    SESSION_SECRET=your_secret_value #node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
    SPOTIFY_CLIENT_ID=your_spotify_client_id # Look at https://developer.spotify.com/documentation/web-api 
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=http://localhost:3000/api/callback
```
### 3. Running the app (Docker)
First, make sure [Docker](https://www.docker.com/) is installed.
Once installed properly, go into the root folder of the project in a terminal.
Run the following commmand: ```docker-compose up --build```
visit [http://localhost:5173](http://localhost:5173)

### 3.1 Running the app (NPM/without docker)
First, on one terminal, change directory to ```/backend``` and ```npm install``` and then ```npm run dev```. Then on another terminal, 
change directory to ```/csci3230u-final-project```  and ```npm install``` and then ```npm run dev```. 

You can access the website at ```http://localhost:5173/```.

## Video
Please view this video if you need more instructions:
