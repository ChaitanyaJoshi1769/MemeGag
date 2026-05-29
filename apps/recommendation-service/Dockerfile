FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/recommendation-service ./apps/recommendation-service
RUN npm ci
RUN npm run build -- --filter=recommendation-service

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/apps/recommendation-service/dist ./dist
COPY --from=builder /app/apps/recommendation-service/package*.json ./
RUN npm ci --only=production
EXPOSE 3011
CMD ["node", "dist/main.js"]
