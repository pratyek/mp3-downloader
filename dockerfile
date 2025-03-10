# Use latest Node.js as base image
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files
COPY . .

# Build environment variables
ARG MONGO_URI
ARG MONGODB_DB
ARG REDIS_URL

# Pass environment variables during build
ENV MONGO_URI=$MONGO_URI
ENV MONGODB_DB=$MONGODB_DB
ENV REDIS_URL=$REDIS_URL

# Build the Next.js application
RUN npm run build

# --- Create the runtime image ---
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm ci --only=production

# Expose application port
EXPOSE 3000

# Pass environment variables to runtime
ENV MONGO_URI=$MONGO_URI
ENV MONGODB_DB=$MONGODB_DB
ENV REDIS_URL=$REDIS_URL

# Start the Next.js server
CMD ["npm", "start"]
