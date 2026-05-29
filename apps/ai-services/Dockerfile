FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json turbo.json ./
COPY packages ./packages
COPY apps/ai-services ./apps/ai-services
RUN npm ci
RUN npm run build -- --filter=ai-services

FROM node:20-alpine
WORKDIR /app
RUN apk add --no-cache curl
COPY --from=builder /app/apps/ai-services/dist ./dist
COPY --from=builder /app/apps/ai-services/package*.json ./
RUN npm ci --only=production
EXPOSE 3006
CMD ["node", "dist/main.js"]
