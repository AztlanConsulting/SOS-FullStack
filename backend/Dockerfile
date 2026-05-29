# ── Builder ──────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src/

RUN npm run build

# ── Production ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
RUN npm install

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "./dist/src/server.js"]
