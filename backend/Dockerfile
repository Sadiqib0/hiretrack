# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install dependencies and rebuild native modules like bcrypt
RUN npm install --build-from-source

# Copy the rest of the backend code
COPY . .

# Expose the backend port (adjust if needed)
EXPOSE 3000

# Start the backend
CMD ["npm", "run", "start:prod"]
