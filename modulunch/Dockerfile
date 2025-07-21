# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy everything else
COPY . .

# Expose the default dev port
EXPOSE 3000

# Default command for dev
CMD ["npm", "run", "dev"]
