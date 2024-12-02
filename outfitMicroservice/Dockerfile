FROM node:22.11.0
# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the app dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on (3011 in this case)
EXPOSE 3011

# Define the command to run your app
CMD ["node", "start.js"]