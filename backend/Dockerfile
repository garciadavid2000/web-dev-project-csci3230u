#using node.js img
FROM node:23.11.0-slim

#set working dir
WORKDIR /app

#copy files
COPY . .

#dependencies
RUN npm install

#expose to port 3000
EXPOSE 3000

#start backend
CMD ["node", "app.js"]