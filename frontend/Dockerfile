FROM node:current-alpine3.20 AS build

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .
 
RUN npm run build

FROM nginx:alpine

COPY --from=build frontend/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

COPY env.sh /docker-entrypoint.d/env.sh

RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
  