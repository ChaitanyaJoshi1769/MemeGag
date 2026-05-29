FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ ffmpeg
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/livestream-service ./apps/livestream-service
RUN npm ci
RUN npm run build -- --filter=livestream-service

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl ffmpeg
COPY --from=builder /app/apps/livestream-service/dist ./dist
COPY --from=builder /app/apps/livestream-service/package*.json ./
RUN npm ci --only=production
EXPOSE 3010
CMD ["node", "dist/main.js"]
