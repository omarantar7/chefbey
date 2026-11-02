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
ARG BASE_URL
ARG RESEND_API_KEY
ARG RECIEVED_Email
ARG NUXT_PUBLIC_GA_ID
ARG CONTENT_LANGUAGES    
ARG RECAPTCHA_SITE_KEY
ARG RECAPTCHA_SECRET_KEY   

ENV BUN_ENV=$BUN_ENV
ENV ETHEREAL_USER=$ETHEREAL_USER
ENV ETHEREAL_PASS=$ETHEREAL_PASS
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV BASE_URL=$BASE_URL
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV RECIEVED_Email=$RECIEVED_Email
ENV NUXT_PUBLIC_GA_ID=$NUXT_PUBLIC_GA_ID
ENV CONTENT_LANGUAGES=$CONTENT_LANGUAGES
ENV RECAPTCHA_SITE_KEY=$RECAPTCHA_SITE_KEY
ENV RECAPTCHA_SECRET_KEY=$RECAPTCHA_SECRET_KEY

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

ENV NODE_ENV=production

EXPOSE 3000
# --smol: trade a bit of CPU (more frequent GC) for a much smaller heap on a 1GB droplet
CMD ["bun", "--smol", ".output/server/index.mjs"]