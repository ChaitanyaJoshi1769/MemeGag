FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/creator-service ./apps/creator-service
RUN npm ci
RUN npm run build -- --filter=creator-service

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/apps/creator-service/dist ./dist
COPY --from=builder /app/apps/creator-service/package*.json ./
RUN npm ci --only=production
EXPOSE 3007
CMD ["node", "dist/main.js"]
