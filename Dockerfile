# Use the node:20-alpine base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app files
COPY . .

# ARG to receive build-time variables
ARG GOOGLE_API_KEY
ARG WEATHER_API_KEY
ARG JWT_SECRET

# Set environment variables for runtime
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}
ENV WEATHER_API_KEY=${WEATHER_API_KEY}
ENV JWT_SECRET=${JWT_SECRET}
ENV PORT=3000

# Expose the port the app will run on
EXPOSE 3000

# Start the app
CMD ["node", "server.mjs"]

