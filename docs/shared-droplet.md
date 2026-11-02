# Shared Droplet: chefbey.org + dental-clinic.cc

| Field | Detail |
|---|---|
| **Date** | November 2, 2026 |
| **Droplet** | DigitalOcean, $12/mo (1 vCPU, 2 GB RAM, 50 GB disk), `165.232.67.62` |
| **Projects** | `chefbey` (this repo), `dental-clinic` (`omarantar7/dental-clinic`) |
| **Author** | Omar Antar |

This document explains everything that was changed to (1) cut chefbey's resource
usage and (2) host the dental-clinic project on the same droplet, plus the
one-time steps to bring dental-clinic live and how to operate both afterwards.

---

## Contents

- [Why](#why)
- [Architecture](#architecture)
- [Part 1 — Resource optimization (already deployed)](#part-1--resource-optimization-already-deployed)
- [Part 2 — Hosting dental-clinic on this droplet](#part-2--hosting-dental-clinic-on-this-droplet)
- [Go-live runbook (one-time, in this order)](#go-live-runbook-one-time-in-this-order)
- [Day-to-day operations](#day-to-day-operations)
- [Memory budget](#memory-budget)
- [Backups](#backups)
- [Troubleshooting](#troubleshooting)
- [Undoing the shared setup](#undoing-the-shared-setup)

---

## Why

- chefbey gets ~60 page views a month but the droplet looked nearly full. Traffic
  was never the problem; uncapped containers, unbounded logs and Bun's default
  heap were.
- After the optimization the whole droplet runs at ~330 MB RAM out of 2 GB, so
  instead of downsizing to $6 we keep the $12 droplet and put a second project
  on it — two sites for the price of one droplet.
- dental-clinic previously expected a droplet of its own (`209.38.222.129`,
  which no longer responds). It had no data worth keeping, so it starts with a
  fresh, empty Postgres here.

---

## Architecture

```
                         Internet
                            │ :80 / :443
                            ▼
              ┌───────────────────────────┐
              │  chefbey_nginx            │  ← the ONLY container publishing 80/443
              │  conf.d/default.conf      │     chefbey.org
              │  conf.d/dental-clinic.conf│     dental-clinic.cc
              └─────┬───────────────┬─────┘
   network:         │               │          network:
   chefbey_default  │               │          web  (external, shared)
                    ▼               ▼
            ┌──────────────┐  ┌───────────────────┐
            │ chefbey:3000 │  │ dental-clinic-app │
            │ (Nuxt / Bun) │  │ :3000 (Next.js)   │
            └──────┬───────┘  └─────────┬─────────┘
                   │                    │   network: dental-clinic_default
             SQLite volume       ┌──────▼─────────────────┐
             chefbey_db          │ dental-clinic-postgres │
                                 └────────────────────────┘

   chefbey_certbot renews the certificates of BOTH domains
   (shared volume certbot_certs, mounted read-only into nginx).
```

Key points:

- **One reverse proxy.** Only one process can listen on ports 80/443, so
  chefbey's nginx terminates TLS for both domains. dental-clinic no longer runs
  its own nginx/certbot on this droplet.
- **Two independent compose projects.** `chefbey` lives in its git checkout
  (e.g. `/root/chefbey`); `dental-clinic` lives in `/opt/dental-clinic`, synced
  by its own CI. Each has its own containers, volumes, `.env` and deploy
  pipeline. Deploying one never restarts the other.
- **A shared Docker network called `web`.** chefbey's nginx and dental-clinic's
  app both join it; that is the only connection between the two projects.
  Postgres and the chefbey app are *not* on it, so neither database is reachable
  from the other project.

---

## Part 1 — Resource optimization (already deployed)

Commit `d1e7e09` on `master`. Live since November 2, 2026.

| Change | File | Why |
|---|---|---|
| `bun --smol` | `Dockerfile` | Bun runs garbage collection more often and keeps a much smaller heap. Costs a little CPU, which this site has plenty of. |
| `NODE_ENV=production` | `Dockerfile` | Ensures libraries take their production code paths. |
| `mem_limit` (app 512m, nginx 64m, certbot 128m) | `docker-compose.yml` | A runaway container gets restarted by Docker instead of starving the whole droplet (SSH included). |
| Log rotation (`json-file`, 3 × 10 MB) | `docker-compose.yml` | Docker logs were unbounded and would slowly fill the disk. |
| App port `3000` no longer published | `docker-compose.yml` | It was reachable from the internet, bypassing nginx/HTTPS (Docker-published ports also bypass `ufw`). nginx reaches it over the internal network. |
| Deleted `server/api/testdb.ts` | — | **Security:** `GET /api/testdb` publicly returned every user row, including password hashes. Admin passwords should be rotated. |

Measured after deploy: ~330 MB RAM used on the whole droplet.

---

## Part 2 — Hosting dental-clinic on this droplet

### Changes in this repo (chefbey)

| Change | File | Why |
|---|---|---|
| New vhost for `dental-clinic.cc` / `www.dental-clinic.cc` | `nginx/dental-clinic.conf` | Same TLS settings and security headers dental-clinic's own `production.conf` had; proxies to `dental-clinic-app:3000`. |
| `proxy_pass http://chefbey:3000` (was `http://app:3000`) | `nginx/default.conf` | Both projects name their service `app`. Once nginx sits on the shared `web` network, the name `app` could resolve to *either* project's container. Container names (`chefbey`, `dental-clinic-app`) are unique. |
| nginx mounts the whole `./nginx` directory | `docker-compose.yml` | A single-file bind mount keeps pointing at the old file after `git pull` replaces it, so `nginx -s reload` silently served the old config (the reason the SSL postmortem needed `--force-recreate`). A directory mount always sees the current files. |
| nginx joins the external `web` network | `docker-compose.yml` | So it can reach `dental-clinic-app`. |
| Deploy creates `web` if missing | `.github/workflows/nuxtjs.yml` | `docker network create web` is idempotent, so a fresh droplet works without manual setup. |
| Deploy aborts if the dental-clinic certificate is missing | `.github/workflows/nuxtjs.yml` | nginx refuses to start when any configured certificate file is missing, which would take **chefbey.org down too**. The check runs before anything is restarted, so the old containers keep serving. |
| `nginx -t &&` before reload | `.github/workflows/nuxtjs.yml` | Never reload a broken config. |

#### Why the dental vhost resolves its upstream per request

```nginx
resolver 127.0.0.11 valid=10s ipv6=off;
set $dental_clinic_app http://dental-clinic-app:3000;
proxy_pass $dental_clinic_app;
```

With a plain `proxy_pass http://dental-clinic-app:3000;` nginx looks the name up
once at startup. That has two failure modes on a shared host:

1. If the dental-clinic app is down when nginx (re)starts, nginx fails with
   `host not found in upstream` — and chefbey.org goes down with it.
2. Every dental-clinic deploy recreates its container with a new IP; nginx would
   keep the old IP and return 502 until someone reloads it — but reloads happen
   only in *chefbey's* pipeline.

Using a variable plus Docker's embedded DNS (`127.0.0.11`) makes nginx resolve
the name per request (cached 10 s). A dental-clinic outage now only means 502s on
dental-clinic.cc, and its deploys need no nginx reload at all.

### Changes in the dental-clinic repo

Branch `chore/shared-droplet` (based on `origin/main`).

| Change | File | Why |
|---|---|---|
| `nginx` and `certbot` moved into the `standalone` profile | `docker-compose.yaml` | They don't start by default, so they don't fight chefbey's nginx for ports 80/443. A server that hosts dental-clinic alone (the planned sandbox) sets `COMPOSE_PROFILES=standalone` and gets them back unchanged. |
| `app` joins the external `web` network | `docker-compose.yaml` | So chefbey's nginx can reach it as `dental-clinic-app`. |
| Creates `web` if missing; reloads its own nginx only if it exists; `docker image prune -af` | `deploy/remote-deploy.sh` | The old script did `docker compose exec nginx …`, which fails when nginx isn't running. Each deploy pulls new SHA-tagged images (the builder one is large), so unused ones are pruned to protect the shared disk. |
| Sandbox `.env` gets `COMPOSE_PROFILES=standalone` | `.github/workflows/deploy.yml` (commented sandbox job) | So when the sandbox job is re-enabled it keeps working as a standalone server. |
| Docs | `docs/deployment.md`, `README.md` | Point here; local dev needs `docker network create web` once. |

Unchanged on purpose: the `production.conf`/`sandbox.conf`/`init-letsencrypt.sh`
files (still used in standalone mode), Postgres, the `migrate` job, the images
and the approval gate on the `env` environment.

---

## Go-live runbook (one-time, in this order)

> ⚠️ **Order matters.** Push chefbey only after step 3 succeeds. Its deploy will
> refuse to run without the dental-clinic certificate (by design), but don't
> rely on that guard.

### 1. Prepare the droplet

```bash
ssh root@165.232.67.62

# Swap: protects both sites from memory spikes (e.g. the Prisma migrate job)
fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

docker network create web             # shared network (CI also does this)
apt-get install -y rsync              # dental-clinic CI syncs files with rsync
mkdir -p /opt/dental-clinic           # owned by the user dental-clinic CI logs in as
```

### 2. Point DNS at this droplet

At the dental-clinic.cc DNS provider, set **A records** for `dental-clinic.cc`
and `www.dental-clinic.cc` → `165.232.67.62`. Wait until both resolve:

```bash
nslookup dental-clinic.cc
nslookup www.dental-clinic.cc
```

### 3. Issue the dental-clinic.cc certificate (with the current chefbey config)

This works *before* any config change: chefbey's first port-80 server block is
nginx's default server, and it already serves `/.well-known/acme-challenge/`
from the shared `certbot_www` volume for any host name.

```bash
cd /root/chefbey   # the chefbey checkout (secrets.PATH)

# Sanity check — must be 404 from nginx, NOT a 301 redirect
curl -I http://dental-clinic.cc/.well-known/acme-challenge/test

docker compose run --rm --entrypoint certbot certbot certonly \
  --webroot -w /var/www/certbot \
  -d dental-clinic.cc -d www.dental-clinic.cc \
  --email YOUR_EMAIL --agree-tos --no-eff-email
```

Expected: `Successfully received certificate … /etc/letsencrypt/live/dental-clinic.cc/fullchain.pem`.
Renewals are then handled automatically by the existing certbot loop and the
host cron job (`certbot renew` covers every certificate in the volume).

### 4. Deploy chefbey

Push `master`. The pipeline pulls the new config and recreates nginx on the
`web` network. Check:

```bash
curl -I https://chefbey.org            # 200 / 301 to /en — chefbey unaffected
curl -I https://dental-clinic.cc       # 502 is EXPECTED: the dental app isn't deployed yet
docker network inspect web --format '{{range .Containers}}{{.Name}} {{end}}'   # chefbey_nginx
```

### 5. Re-point dental-clinic's CI at this droplet

In GitHub → `omarantar7/dental-clinic` → Settings → Environments → **`env`**:

| Name | New value |
|---|---|
| `SSH_HOST` | `165.232.67.62` |
| `SSH_USER` / `SSH_PORT` | the user/port for this droplet |
| `SSH_KEY` | a private key whose public key is in that user's `~/.ssh/authorized_keys` on this droplet |
| `APP_URL` (variable) | `https://dental-clinic.cc` (unchanged) |

`POSTGRES_*` secrets are used to initialise the **new, empty** database on first
start, so whatever they are now becomes the real credentials. `NGINX_CONF_FILE`
is ignored on this droplet. Do **not** set `COMPOSE_PROFILES` for `env`.

### 6. Deploy dental-clinic

Merge `chore/shared-droplet` into `main` and push. Approve the
`deploy-production` job. The pipeline runs migrations into the fresh Postgres,
starts the app and smoke-tests `https://dental-clinic.cc/`.

```bash
docker ps --format 'table {{.Names}}\t{{.Status}}'
# expect: chefbey, chefbey_nginx, chefbey_certbot,
#         dental-clinic-app, dental-clinic-postgres  (dental-clinic-migrate: Exited (0))
docker network inspect web --format '{{range .Containers}}{{.Name}} {{end}}'
# expect: chefbey_nginx dental-clinic-app
```

### 7. Create the first doctor account

The database is empty. Run the interactive script inside the builder image
(it has the full source and `tsx`; `DATABASE_URL` comes from compose):

```bash
cd /opt/dental-clinic
docker compose run --rm -it migrate npx tsx src/scripts/create-doctor.ts
```

> ⚠️ Never run the Prisma seed (`src/prisma/seed.ts`) in production — it wipes
> every table first.

### 8. Clean up

Destroy the old dental-clinic droplet (`209.38.222.129`) in DigitalOcean if it
still exists, so it stops billing.

---

## Day-to-day operations

| Task | How |
|---|---|
| Deploy chefbey | push `master` (unchanged) |
| Deploy dental-clinic | push `main` + approve (unchanged) |
| Change either domain's nginx config | edit `nginx/*.conf` **in this repo**, push `master` |
| Add a third project | give its app a unique `container_name`, join it to the external `web` network, don't publish 80/443, add a vhost here (copy `dental-clinic.conf`), issue its certificate as in step 3 *before* pushing the vhost, and extend the certificate guard in `nuxtjs.yml` |
| See what's using resources | `docker stats --no-stream`, `free -h`, `docker system df`, `df -h` |
| Logs | `docker logs --tail 100 chefbey` / `dental-clinic-app` / `chefbey_nginx` |

---

## Memory budget

| Container | Limit | Expected use |
|---|---|---|
| chefbey (Bun, `--smol`) | 512 MB | ~100–200 MB |
| chefbey_nginx (both domains) | 64 MB | ~5–15 MB |
| chefbey_certbot | 128 MB | ~5 MB idle |
| dental-clinic-app (Next.js standalone) | 512 MB | ~100–250 MB |
| dental-clinic-postgres | 512 MB | ~50–150 MB |
| dental-clinic-migrate | — | runs for seconds during deploys, then exits |
| OS + Docker | — | ~250 MB |

Roughly 0.6–1.1 GB of 2 GB in normal operation, plus 2 GB swap as headroom.
Limits are ceilings, not reservations. Check the real numbers with
`docker stats --no-stream` a few days after go-live.

---

## Backups

Neither database is backed up automatically. Either enable DigitalOcean droplet
backups (+20% of the droplet price) or add a nightly host cron job. Save this as
`/root/backup.sh` (`chmod +x`):

```bash
#!/usr/bin/env bash
# Nightly backup of both databases, keeps 14 days
set -euo pipefail
mkdir -p /root/backups
day=$(date +%F)

docker run --rm -v chefbey_chefbey_db:/src:ro -v /root/backups:/b alpine \
  tar czf "/b/chefbey-db-$day.tgz" -C /src .

docker exec dental-clinic-postgres sh -c 'pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB"' \
  | gzip > "/root/backups/dental-clinic-$day.sql.gz"

find /root/backups -type f -mtime +14 -delete
```

and schedule it with `crontab -e`:

```
0 2 * * * /root/backup.sh >> /var/log/backup.log 2>&1
```

Copy them off the droplet now and then (`scp -r root@165.232.67.62:/root/backups .`).
Volume names are prefixed with the compose project (folder) name — confirm with
`docker volume ls`.

---

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| chefbey deploy fails with `dental-clinic.cc certificate is missing` | Step 3 hasn't been done (or the cert was deleted). Nothing was restarted; issue the cert, then re-run the workflow. |
| `https://dental-clinic.cc` → 502 | The dental app container is down or not on `web`. `docker ps -a \| grep dental`, `docker logs dental-clinic-app`, `docker network inspect web`. |
| dental-clinic deploy: `network web declared as external, but could not be found` | Run `docker network create web` (the deploy script normally does this). |
| dental-clinic app won't start | `docker logs dental-clinic-migrate` — the app waits for the migration job to succeed. |
| nginx won't start after a config change | `docker logs chefbey_nginx`; test with `docker exec chefbey_nginx nginx -t`. |
| chefbey.org shows dental-clinic content (or vice versa) | Some `proxy_pass` uses the service name `app` instead of a container name. |
| Certificate expiry | Same mechanism as before for both domains: the certbot loop and the host cron job. Check with `curl -vI https://dental-clinic.cc 2>&1 \| grep expire`. |

---

## Undoing the shared setup

1. Move dental-clinic to its own server: set that server's `.env` to
   `COMPOSE_PROFILES=standalone` (add `echo "COMPOSE_PROFILES=standalone"` to the
   production job's `.env` block), point the `env` secrets and DNS there, and run
   `nginx/init-letsencrypt.sh` on it as in dental-clinic's `docs/deployment.md`.
   Move the data with `pg_dump` / `psql`.
2. Here: delete `nginx/dental-clinic.conf` and the certificate guard line in
   `.github/workflows/nuxtjs.yml`, push `master`, then
   `cd /opt/dental-clinic && docker compose down` (add `-v` only once the data is moved).
