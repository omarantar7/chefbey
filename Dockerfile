FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production
FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built output
COPY --from=builder /app/.output ./.output

# Copy db migrations and schema for runtime
COPY --from=builder /app/lib/db ./lib/db

# Create uploads directory
RUN mkdir -p .output/public/uploads

# Expose port
EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
