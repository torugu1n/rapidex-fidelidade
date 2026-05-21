# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy dependency configs and install packages
COPY package*.json ./
RUN npm ci

# Copy the rest of the codebase and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
