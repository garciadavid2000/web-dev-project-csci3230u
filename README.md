# web-dev-project-csci3230u
## Setup Instructions

# Demo Video (contains setup instructions at the end)
[Demo](https://youtu.be/Stx6hZZpnxs)

### 1. Setting up the Spotify App
First, make sure you have a Spotify account. Sign in to https://developer.spotify.com and click on the dashboard, and create an app. Give it any name and description you want 
**but make sure the Redirect URL is set to: ```http://localhost:3000/api/callback```.** Web API is going to be used. Click on save. 

Note that this method may be changed in the future. If you cannot generate the Web API using the Redirect URI ```http://localhost:3000/api/callback```, check canvas submission comments. We have provided one of our spotify keys which you can use.

### 2. Setting up the .env file
Create a .env in the ```/backend``` folder and add the following environment variables:
   ```bash
    SESSION_SECRET=your_secret_value #node -e "console.log(require('crypto').randomBytes(64).toString('hex'));"
    SPOTIFY_CLIENT_ID=your_spotify_client_id # Look at https://developer.spotify.com/documentation/web-api 
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
    SPOTIFY_REDIRECT_URI=http://localhost:3000/api/callback
```
### 3. Running the app (Docker)
- First, make sure [Docker](https://www.docker.com/) is installed.
- Once installed, go into the root folder of the project in a terminal.
- Run the following commmand: ```docker-compose up --build```
- Visit [http://localhost:5173](http://localhost:5173)

### 3.1 Running the app (NPM/without docker)
- To run the app without docker (using npm), you need to edit ./csci3230u-final-project/vite.config.js
- Replace line 21 with ```target: 'http://localhost:3000'```
- comment out line the following lines (line 17 & 18): 
```host: '0.0.0.0',```
```port: 5173,```


- First, on one terminal, change directory to ```/backend``` and ```npm install``` and then ```npm run dev```. 
- Then on another terminal, 
change directory to ```/csci3230u-final-project```  and ```npm install``` and then ```npm run dev```. 
- You can now access the website at [http://localhost:5173](http://localhost:5173)


## Video
If you need further instructions setting up the project, check the youtube video linked at the top.
