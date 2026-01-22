# Dockerfile (Node.js API) for EcoRide
FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the project (server.js, src/, public/, etc.)
COPY . .

# Your server uses PORT from env (defaults in .env)
EXPOSE 3000

# Start the API
CMD ["npm", "start"]
