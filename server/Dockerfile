# Use official Node.js version 18 as base image
FROM node:18

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if you have it)
COPY package*.json ./

# Install dependencies (only production dependencies)
RUN npm install --production

# Copy the rest of your app's source code into the container
COPY . .

# Expose the port your app will run on (usually 3000)
EXPOSE 5000

# Start your app with node, replace index.js if your main file has a different name
CMD ["node", "server.js"]
