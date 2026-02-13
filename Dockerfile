# -------------------------
# Stage 1: Build React App
# -------------------------
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Build the project
RUN npm run build


# -------------------------
# Stage 2: Serve with Nginx
# -------------------------
FROM nginx:alpine

# Remove default nginx files
RUN rm -rf /usr/share/nginx/html/*

# Copy build output to nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
