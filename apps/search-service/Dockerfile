FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/search-service ./apps/search-service
RUN npm ci
RUN npm run build -- --filter=search-service

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/apps/search-service/dist ./dist
COPY --from=builder /app/apps/search-service/package*.json ./
RUN npm ci --only=production
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3003/health || exit 1
EXPOSE 3003
CMD ["node", "dist/main.js"]
