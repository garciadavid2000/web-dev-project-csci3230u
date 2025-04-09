#using node
FROM node:18.20.8-slim AS build-stage

#working dir..
WORKDIR /app

#copy only frontend (joining backend later..?)
COPY csci3230u-final-project/package*.json ./
RUN npm install

#copy other frontend files
COPY csci3230u-final-project/ .

RUN npm run build

#serving with nginx
FROM nginx:1.25.3-alpine AS production-stage

#copy frontend to nginx web dir
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
