FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/analytics-service ./apps/analytics-service
RUN npm ci
RUN npm run build -- --filter=analytics-service

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/analytics-service/dist ./dist
COPY --from=builder /app/apps/analytics-service/package*.json ./
RUN npm ci --only=production
EXPOSE 3009
CMD ["node", "dist/main.js"]
