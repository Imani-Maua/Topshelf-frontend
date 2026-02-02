FROM node:20-alpine as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .
RUN npm run build

FROM node:20-alpine as dev-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]


FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]