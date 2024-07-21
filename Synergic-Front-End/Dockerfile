# stage 1: build the app
FROM node:slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

# stage 2: serve the app using nginx
FROM nginx:alpine 
COPY  --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]