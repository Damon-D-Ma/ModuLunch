# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files (including server/, pages/, etc.)
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port your server runs on (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["node", "server/server.js"]
