FROM node:20-alpine AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
RUN npm run build

FROM node:20-alpine AS lint
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "lint"]

FROM node:20-alpine AS test

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . . 

CMD ["npm", "run", "test", "--", "--run"]

FROM node:20-alpine AS dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]


FROM nginx:stable-alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]