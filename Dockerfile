FROM node:20.16.0-bookworm
LABEL maintainer="Shigbeard <shigbeard@triumphtf2.com>"
LABEL version="1.0"
LABEL description="Dockerfile for the TriumphTF2 website"


# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the files
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 80

# Start the server
ENTRYPOINT [ "npm", "run", "start" ]
