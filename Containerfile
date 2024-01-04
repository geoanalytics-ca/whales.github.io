# Use the official Node.js 14 image as the base image
FROM node:21.5.0-slim

RUN npm install -g npm
# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Start the Next.js application
CMD ["npm", "start"]
