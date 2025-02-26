# 1) Build stage
FROM node:20.2.0-alpine AS build

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

ENV NEXT_PUBLIC_BACKEND_URL=wss://api.play-onitama.com

# Build the Next.js application (production build)
RUN npm run build

# 2) Production stage
FROM node:20.2.0-alpine

WORKDIR /app

# Copy only the production build and necessary files
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

# Re-install prod dependencies (optional but often good practice)
RUN npm install --production

# Expose Next.js default port
EXPOSE 3000

# Start Next.js in production
CMD ["npm", "run", "start"]
