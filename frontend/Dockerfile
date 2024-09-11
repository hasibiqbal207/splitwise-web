# syntax=docker/dockerfile:1

# Stage 1: Build the React app
ARG NODE_VERSION=18.17.1
FROM node:${NODE_VERSION}-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source files and build the app
COPY . .

# Run the build script.
RUN npm run build

# Stage 2: Serve the React app with Nginx
FROM nginx:alpine

# Copy the build output to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 6004
EXPOSE 6004

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]