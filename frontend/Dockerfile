# Use official Node.js image as the base image
FROM node:current-alpine3.20 AS build

RUN npm install -g vite

# Set the working directory inside the container
WORKDIR /frontend

# Copy package.json and yarn.lock to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

RUN npm run build

# Use nginx as the production server
FROM nginx:alpine

# Copy the built app from the previous stage
COPY --from=build /frontend/dist /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx server when the container starts
CMD ["nginx", "-g", "daemon off;"]
