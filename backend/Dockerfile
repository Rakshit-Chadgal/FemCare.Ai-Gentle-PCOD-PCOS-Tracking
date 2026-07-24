# ── Stage 1: install production dependencies ─────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: production image ─────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Run as non-root for security
RUN addgroup -S femcare && adduser -S femcare -G femcare
USER femcare

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src

EXPOSE 4000

# Tini handles PID 1 signal forwarding so graceful shutdown works correctly
# under ECS (SIGTERM -> Express -> Mongoose connection close)
ENTRYPOINT ["node", "src/index.js"]
