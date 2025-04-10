# Stage 1: Build the frontend
FROM node:23.11.0-slim AS build-stage

WORKDIR /app

# Copy package.json and package-lock.json from the csci3230u-final-project folder
COPY csci3230u-final-project/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the files from the csci3230u-final-project folder
COPY csci3230u-final-project/ ./

# Build the frontend using Vite
# RUN npm build
# Stage 2: Serve the built frontend using `serve`
# FROM node:23.11.0-slim AS production-stage

# WORKDIR /app

# Copy the built files from the previous stage
# COPY --from=build-stage /app/dist ./dist

# Install `serve` globally to serve static files
# RUN npm install -g serve

# Expose the port for the frontend
EXPOSE 5173

# Command to run the server
CMD ["npm", "run", "dev"]