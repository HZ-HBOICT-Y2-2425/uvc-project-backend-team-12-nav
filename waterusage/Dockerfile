FROM node:22.11.0
# Use the official Node.js LTS image

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 3011

# Start the backend server
CMD ["npm", "start"]

RUN mkdir -p /usr/src/app