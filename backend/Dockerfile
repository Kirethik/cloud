# Base image
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source
COPY . .

# Generate Prisma Client and build TS
RUN npx prisma generate
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app

# Copy needed files from build
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Expose port
EXPOSE 8080

# Environment variables
ENV NODE_ENV=production

# Start command
CMD ["npm", "run", "start"]
