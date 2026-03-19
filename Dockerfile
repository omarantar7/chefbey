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

ENV BUN_ENV=$BUN_ENV
ENV ETHEREAL_USER=$ETHEREAL_USER
ENV ETHEREAL_PASS=$ETHEREAL_PASS
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV CONTENT_LANGUAGES=$CONTENT_LANGUAGES
ENV BASE_URL=$BASE_URL
ENV NUXT_DB_FILE_NAME=$NUXT_DB_FILE_NAME
ENV RECIEVED_Email=$RECIEVED_Email
ENV RESEND_API_KEY=$RESEND_API_KEY

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

# Fix missing libsql dependency
COPY --from=builder /app/node_modules/@libsql /app/.output/server/node_modules/@libsql

RUN mkdir -p .output/public/uploads

EXPOSE 3000
CMD ["bun", ".output/server/index.mjs"]