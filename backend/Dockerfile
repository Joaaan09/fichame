# Select a base image
FROM node:20-alpine

# Create a directory and go to the directory
WORKDIR /app

# Copy the package.json file to install dependencies
COPY package.json .

# Install dependencies
RUN npm install

# Copy other files to current directory
COPY . .

# Open the port for the express server
EXPOSE 3000

# Run the server
CMD ["npm", "start"]