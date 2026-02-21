FROM node:20-alpine

WORKDIR /app

# Copy backend package files first for better layer caching
COPY backend/package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the backend source
COPY backend/ .

# Expose the port Railway will assign dynamically
EXPOSE 5001

# Start the server
CMD ["node", "index.js"]
