FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NUXT_PUBLIC_GA_ID
ENV NUXT_PUBLIC_GA_ID=$NUXT_PUBLIC_GA_ID

RUN bun run build

# Production
FROM oven/bun:1-slim AS runner
WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/config ./config
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/@libsql /app/.output/server/node_modules/@libsql

RUN mkdir -p .output/public/uploads

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]