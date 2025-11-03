# Start your image with a node base image
FROM node:20-alpine

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Install node packages
RUN npm install

# Copy all necessary files
COPY . .

# Build the CSS using Tailwind
RUN npm run build:css

# Copy the built files to the Docker image
COPY ./dist ./dist

# Install serve
RUN npm install -g serve

EXPOSE 3000

# Start the app using serve command
CMD ["serve", "-s", "dist"]
