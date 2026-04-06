# ─── Stage 1: base ────────────────────────────────────────────────────────────
# Pin a specific bun version so the cache key is stable across CI runs.
# Upgrade intentionally, not accidentally.
FROM oven/bun:1.2-alpine AS base
WORKDIR /app

# ─── Stage 2: deps ────────────────────────────────────────────────────────────
# Only package.json + bun.lock are copied here.
# This layer is cached until those two files change → installs are skipped
# on every rebuild that doesn't touch dependencies.
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ─── Stage 3: builder ─────────────────────────────────────────────────────────
# Source code is copied AFTER node_modules so a code change doesn't
# bust the install cache.
FROM base AS builder
WORKDIR /app

# Re-use the already-installed modules from the deps stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy source — most frequently changing layer goes last.
COPY . .

# Build-time secrets injected as ARGs (never baked into earlier layers).
ARG BUN_ENV
ARG ETHEREAL_USER
ARG ETHEREAL_PASS
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG CONTENT_LANGUAGES
ARG BASE_URL
ARG NUXT_DB_FILE_NAME
ARG RECIEVED_Email
ARG RESEND_API_KEY
ARG NUXT_PUBLIC_GA_ID

ENV BUN_ENV=$BUN_ENV \
    ETHEREAL_USER=$ETHEREAL_USER \
    ETHEREAL_PASS=$ETHEREAL_PASS \
    BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET \
    BETTER_AUTH_URL=$BETTER_AUTH_URL \
    CONTENT_LANGUAGES=$CONTENT_LANGUAGES \
    BASE_URL=$BASE_URL \
    NUXT_DB_FILE_NAME=$NUXT_DB_FILE_NAME \
    RECIEVED_Email=$RECIEVED_Email \
    RESEND_API_KEY=$RESEND_API_KEY \
    NUXT_PUBLIC_GA_ID=$NUXT_PUBLIC_GA_ID \
    # Nuxt telemetry adds latency and random network calls during build.
    NUXT_TELEMETRY_DISABLED=1 \
    # Prevent Nuxt from spawning a second bun process for postinstall.
    NODE_OPTIONS="--max-old-space-size=1536"

RUN bun run build

# ─── Stage 4: runner (production) ─────────────────────────────────────────────
# bun:1.2-alpine-slim keeps the image under ~100 MB.
FROM oven/bun:1.2-alpine AS runner
WORKDIR /app

# Create a non-root user — good practice; some hosts require it.
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nuxt

# Only copy what the runtime actually needs.
COPY --from=builder --chown=nuxt:nodejs /app/.output          ./.output
COPY --from=builder --chown=nuxt:nodejs /app/node_modules     ./node_modules
COPY --from=builder --chown=nuxt:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=nuxt:nodejs /app/lib              ./lib
COPY --from=builder --chown=nuxt:nodejs /app/scripts          ./scripts
COPY --from=builder --chown=nuxt:nodejs /app/config           ./config

# Fix the libsql native binding that Nuxt's bundler doesn't inline.
COPY --from=builder /app/node_modules/@libsql \
                    /app/.output/server/node_modules/@libsql

RUN mkdir -p .output/public/uploads \
 && chown nuxt:nodejs .output/public/uploads

USER nuxt

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]