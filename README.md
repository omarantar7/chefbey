# ChefBey

> A multilingual CMS-powered personal website for Chef Bey — built with Nuxt 3, SQLite, and Drizzle ORM. The chef manages all site content (services, recipes, experience, and more) through a private admin dashboard at `/admin/`.

![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?style=flat&logo=nuxt.js) ![Bun](https://img.shields.io/badge/Bun-1.x-black?style=flat&logo=bun) ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite) ![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat&logo=docker)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Admin Dashboard](#admin-dashboard)
- [Internationalization](#internationalization)
- [Deployment](#deployment)
- [Infrastructure](#infrastructure)
- [CI/CD Pipeline](#cicd-pipeline)
- [SSL & Certificates](#ssl--certificates)
- [Postmortems](#postmortems)

---

## Overview

ChefBey is a server-side rendered (SSR) website that serves as the digital presence of Chef Bey. It is fully content-managed — the chef can update every section of the website through a protected admin dashboard without touching any code.

**Key capabilities:**
- SSR with Nuxt 3 for fast page loads and SEO
- Full CMS dashboard at `/admin/` for managing all content
- Multilingual support (English, Arabic, Turkish)
- File upload support for images and media
- Email notifications via Resend
- Google Analytics integration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 3 |
| Runtime | Bun |
| Database | SQLite via libsql |
| ORM | Drizzle ORM |
| Auth | Better Auth |
| Email | Resend |
| Reverse Proxy | nginx |
| SSL | Let's Encrypt + Certbot |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Registry | GitHub Container Registry (ghcr.io) |

---

## Project Structure

```
chefbey/
├── .github/
│   └── workflows/
│       └── nuxtjs.yml          # CI/CD pipeline
├── config/                     # App configuration
├── docs/
│   └── postmortems/            # Incident postmortems
├── lib/                        # Shared utilities
├── nginx/
│   └── default.conf            # nginx reverse proxy config
├── scripts/                    # DB migration and seed scripts
├── Dockerfile                  # Multi-stage production build
├── docker-compose.yml          # Production services
└── drizzle.config.ts           # Drizzle ORM config
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com) (for production)

### Install dependencies

```bash
bun install
```

### Run the development server

```bash
bun run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
bun run build
```

### Preview production build locally

```bash
bun run preview
```

---

## Environment Variables

Create a `.env` file in the project root. All variables are required for production.

```env
# App
BUN_ENV=production
BASE_URL=https://chefbey.org
CONTENT_LANGUAGES=en,ar,tr

# Auth
BETTER_AUTH_SECRET=your_secret_here
BETTER_AUTH_URL=https://chefbey.org

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
RECIEVED_Email=chef@chefbey.org

# Email (Ethereal — dev/staging only)
ETHEREAL_USER=your_ethereal_user
ETHEREAL_PASS=your_ethereal_pass

# Analytics
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

> **Never commit `.env` to version control.** All secrets are stored in GitHub Actions secrets for CI/CD.

---

## Admin Dashboard

The admin dashboard is available at `/admin/` and is protected by authentication via Better Auth.

The chef can manage through the dashboard:
- Page content (hero, about, services, experience)
- Recipes
- Media uploads
- Site settings

---

## Internationalization

The site supports three languages:

| Language | Code |
|---|---|
| English | `en` |
| Arabic | `ar` |
| Turkish | `tr` |

Languages are configured via the `CONTENT_LANGUAGES` environment variable. The default locale prefix is applied to all routes (e.g. `/en/`, `/ar/`, `/tr/`).

---

## Deployment

The app is deployed on a DigitalOcean Ubuntu droplet using Docker Compose. Deployments are fully automated via GitHub Actions on every push to `master`.

### Services

```
chefbey          → Nuxt app (port 3000, internal only)
chefbey_nginx    → nginx reverse proxy (ports 80, 443)
chefbey_certbot  → Let's Encrypt SSL renewal
```

### Volumes

```
chefbey_db        → SQLite database persistence
chefbey_uploads   → User uploaded media files
certbot_www       → ACME challenge webroot
certbot_certs     → SSL certificates
```

---

## Infrastructure

### Docker Compose

The full stack is defined in `docker-compose.yml`. To start all services:

```bash
docker compose up -d
```

To pull the latest app image and redeploy:

```bash
docker compose pull app
docker compose up -d --no-build
```

### nginx

nginx handles:
- HTTP → HTTPS redirect
- `www` → non-www redirect
- SSL termination
- Reverse proxy to the Nuxt app on port 3000
- Serving Let's Encrypt ACME challenge files

Config: `nginx/default.conf`

To reload nginx config without downtime:

```bash
docker exec chefbey_nginx nginx -t && docker exec chefbey_nginx nginx -s reload
```

### Dockerfile

The app uses a multi-stage build:

| Stage | Purpose |
|---|---|
| `deps` | Install dependencies |
| `builder` | Build the Nuxt app |
| `runner` | Lean production image |

Build args are injected at build time via GitHub Actions secrets and baked into the final image.

---

## CI/CD Pipeline

Defined in `.github/workflows/nuxtjs.yml`. Triggered on every push to `master`.

### Job 1 — Build & Push

- Builds the Docker image with all build args from GitHub secrets
- Pushes to `ghcr.io/omarantar7/chefbey:latest`
- Uses layer caching via `ghcr.io/omarantar7/chefbey:cache`

### Job 2 — Deploy

- SSHs into the production server
- Pulls latest code (`git pull`)
- Pulls the new Docker image
- Restarts services with `docker compose up -d`
- Reloads nginx to pick up any config changes

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `SSH_HOST` | Production server IP |
| `SSH_USER` | SSH username |
| `SSH_KEY` | Private SSH key |
| `SSH_PORT` | SSH port |
| `PATH` | Project path on server |
| `GH_TOKEN` | GitHub token for ghcr.io login |
| `BETTER_AUTH_SECRET` | Auth secret |
| `RESEND_API_KEY` | Resend email API key |
| `RECIEVED_Email` | Notification email |
| `ETHEREAL_USER` | Ethereal SMTP user |
| `ETHEREAL_PASS` | Ethereal SMTP password |
| `NUXT_PUBLIC_GA_ID` | Google Analytics ID |

---

## SSL & Certificates

SSL is managed by Let's Encrypt via the `certbot/certbot` Docker image. Certificates are valid for 90 days and auto-renewed.

### How renewal works

1. Certbot runs a loop every 12 hours inside the container and renews if within 30 days of expiry
2. A host-level cron job runs daily at 3am as a safety net and reloads nginx after renewal

### Host cron job (set up once on the server)

```bash
crontab -e

# Add this line:
0 3 * * * cd /root/chefbey && docker compose run --rm --entrypoint certbot certbot renew --quiet && docker exec chefbey_nginx nginx -s reload
```

### Manual renewal (if needed)

```bash
# Stop the running certbot loop
docker compose stop certbot

# Force renew
docker compose run --rm --entrypoint certbot certbot renew --force-renewal

# Reload nginx to serve the new cert
docker exec chefbey_nginx nginx -s reload

# Restart certbot loop
docker compose up -d certbot
```

### Check certificate expiry

```bash
curl -vI https://chefbey.org 2>&1 | grep expire
```

> **Important:** The ACME challenge is served at `/.well-known/acme-challenge/` directly by nginx — it must never be proxied to the Nuxt app. The nginx config handles this with a dedicated `location` block on both port 80 and 443.

---

## Postmortems

Past incidents are documented in `docs/postmortems/`.

| Date | Incident | Severity |
|---|---|---|
| [2026-06-13](docs/postmortems/2026-06-13-ssl-expiry.md) | SSL certificate expiry — site marked insecure | P1 |