FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/media-service ./apps/media-service
RUN npm ci
RUN npm run build -- --filter=media-service

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl cairo jpeg pango giflib
COPY --from=builder /app/apps/media-service/dist ./dist
COPY --from=builder /app/apps/media-service/package*.json ./
RUN npm ci --only=production
EXPOSE 3008
CMD ["node", "dist/main.js"]
