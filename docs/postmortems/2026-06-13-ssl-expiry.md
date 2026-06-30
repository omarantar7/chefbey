# Postmortem: SSL Certificate Expiry — chefbey.org

| Field | Detail |
|---|---|
| **Date of Incident** | June 13, 2026 |
| **Severity** | P1 — Site completely untrusted by browsers |
| **Duration** | ~30 days of silent renewal failure, full outage on cert expiry |
| **Affected Service** | chefbey.org (production) |
| **Author** | Omar Antar |
| **Status** | Resolved ✅ |

---

## Summary

The SSL certificate for `chefbey.org` expired, causing browsers to mark the site as insecure and blocking users from accessing it. The root cause was a misconfigured nginx redirect that prevented Let's Encrypt from completing its domain ownership challenge (ACME HTTP-01). Certbot had been silently failing to renew the certificate for approximately 30 days before the cert expired. The incident was resolved by fixing the nginx config, force-renewing the certificate, and adding a host-level cron job to ensure nginx reloads after every renewal.

---

## Timeline

| Time | Event |
|---|---|
| ~Day 0 (8 weeks ago) | Certificate issued successfully. nginx and certbot deployed via Docker. |
| ~Day 60 | Certificate enters the 30-day renewal window. Certbot begins attempting renewal every 12h. |
| ~Day 60–90 | All renewal attempts silently fail. ACME challenge blocked by nginx redirect bug. No alerts configured. |
| June 13, 2026 | Certificate expires. Browsers display red HTTPS warning. Site effectively down for new users. |
| June 13, 2026 | Incident detected. Investigation begins. |
| June 13, 2026 | nginx config fixed, certificate force-renewed, site restored. |
| June 13, 2026 | Permanent fixes deployed: cron job added, CI/CD updated, docker-compose fixed. |

---

## Root Cause Analysis

### What is ACME?

Let's Encrypt uses the ACME protocol to verify domain ownership before issuing SSL certificates. The most common method is the **HTTP-01 challenge**:

1. Let's Encrypt instructs certbot to place a file at `http://domain.com/.well-known/acme-challenge/TOKEN`
2. Certbot writes the file to `/var/www/certbot`
3. Let's Encrypt fetches that URL from the internet
4. Success → certificate issued. Failure → renewal rejected.

### Bug 1 — nginx bare `return` directive fires before `location` blocks

In the HTTP server block, a bare `return 301` was placed at the server level:

```nginx
# ❌ BEFORE
server {
    listen 80;
    server_name chefbey.org www.chefbey.org;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    return 301 https://chefbey.org$request_uri;
}
```

In nginx, a `return` directive at the server level is evaluated **before** `location` blocks. This means every request — including the ACME challenge — was redirected to HTTPS before certbot could serve the challenge file.

### Bug 2 — Nuxt i18n intercepted the challenge on HTTPS

After being redirected to HTTPS, the request reached the Nuxt app. The i18n middleware redirected `/.well-known/acme-challenge/` to `/en/.well-known/acme-challenge/`, which returned a 404. Let's Encrypt saw:

```
Detail: Invalid response from https://chefbey.org/en/.well-known/acme-challenge/TOKEN: 404
```

### Bug 3 — Certbot could not reload nginx after renewal

The `docker-compose.yml` certbot entrypoint included a `--deploy-hook` to reload nginx after a successful renewal:

```yaml
entrypoint: "... certbot renew --deploy-hook 'docker exec chefbey_nginx nginx -s reload' ..."
```

However, the `docker` binary does not exist inside the certbot container, so even if renewal had succeeded, nginx would never have reloaded to serve the new certificate:

```
Unable to find deploy-hook command docker in the PATH.
```

### Bug 4 — No alerting on renewal failure

Certbot was silently failing every 12 hours for ~30 days. There were no alerts, no monitoring, and no notification mechanism to inform the team of repeated renewal failures.

---

## Impact

- All visitors to `chefbey.org` were shown a browser security warning
- Users without the ability to bypass the warning could not access the site
- Duration of user-facing impact: from certificate expiry until fix (~several hours on June 13, 2026)
- Duration of silent failure: ~30 days

---

## Resolution

### Immediate actions (June 13, 2026)

```bash
# 1. Force recreate nginx to load fixed config
docker compose up -d --force-recreate nginx

# 2. Verify ACME challenge is now served correctly (expected: 404, not 301)
curl -v http://chefbey.org/.well-known/acme-challenge/test

# 3. Stop running certbot loop to avoid conflicts
docker compose stop certbot

# 4. Force renew the expired certificate
docker compose run --rm --entrypoint certbot certbot renew --force-renewal

# 5. Reload nginx to serve the new certificate
docker exec chefbey_nginx nginx -s reload

# 6. Restart certbot with fixed entrypoint
docker compose up -d certbot
```

### Permanent fixes

**Fix 1 — `nginx/default.conf`**

Changed bare `return 301` to `location /` so the ACME challenge location is evaluated first. Also added the challenge location to the HTTPS server block:

```nginx
# ✅ AFTER
server {
    listen 80;
    server_name chefbey.org www.chefbey.org;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://chefbey.org$request_uri;
    }
}

server {
    listen 443 ssl;
    server_name chefbey.org;
    # ...

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        proxy_pass http://app:3000;
        # ...
    }
}
```

**Fix 2 — `docker-compose.yml`**

Removed the broken `--deploy-hook` from the certbot entrypoint:

```yaml
# ✅ AFTER
entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --quiet; sleep 12h & wait $${!}; done;'"
```

**Fix 3 — Host cron job**

Added a daily cron job on the host server that renews and reloads nginx from outside the containers where `docker` is available:

```bash
0 3 * * * cd /root/chefbey && docker compose run --rm --entrypoint certbot certbot renew --quiet && docker exec chefbey_nginx nginx -s reload
```

**Fix 4 — CI/CD pipeline**

Added `nginx -s reload` at the end of every deploy so nginx always picks up config or cert changes:

```yaml
script: |
  # ... existing steps ...
  docker exec chefbey_nginx nginx -s reload
```

---

## What Did Not Work During Recovery

| Attempt | Reason it failed |
|---|---|
| `certbot renew --deploy-hook "docker exec ..."` | `docker` binary not in certbot container PATH |
| `certbot renew --no-deploy-hook` | Deploy hook was also saved in `/etc/letsencrypt/renewal/chefbey.org.conf` |
| `docker compose run --rm certbot certbot renew` | Compose entrypoint itself contained the deploy hook |
| `docker exec chefbey_certbot certbot renew` | Another certbot instance already running in background loop |

**Final working command:**
```bash
docker compose run --rm --entrypoint certbot certbot renew --force-renewal
```
Overriding the entrypoint bypassed the broken deploy hook entirely.

---

## Action Items

| Action | Owner | Status |
|---|---|---|
| Fix nginx `location /` redirect | Engineering | ✅ Done |
| Add ACME challenge location to 443 block | Engineering | ✅ Done |
| Remove broken `--deploy-hook` from certbot entrypoint | Engineering | ✅ Done |
| Add host cron job for renewal + nginx reload | Engineering | ✅ Done |
| Add `nginx -s reload` to CI/CD pipeline | Engineering | ✅ Done |
| Add SSL expiry monitoring/alerting | Engineering | ⏳ Pending |

---

## Prevention

### SSL expiry monitoring (recommended next step)

Set up an external monitor to alert before the cert expires. Free options:

- **UptimeRobot** — monitors SSL expiry and sends email/Slack alerts
- **healthchecks.io** — can monitor the cron job itself to confirm it ran successfully

Add the cron job to healthchecks.io:

```bash
0 3 * * * cd /root/chefbey && docker compose run --rm --entrypoint certbot certbot renew --quiet && docker exec chefbey_nginx nginx -s reload && curl -fsS https://hc-ping.com/YOUR-UUID > /dev/null
```

---

## Lessons Learned

1. **Silent failures are the most dangerous.** Certbot was failing for 30 days with no one knowing. Every critical background job needs alerting.
2. **Test the full renewal flow after initial setup.** A dry run (`certbot renew --dry-run`) immediately after deployment would have caught this.
3. **nginx directive order matters.** Server-level `return` fires before `location` blocks — always use `location /` for redirects when you have other location blocks that must match first.
4. **Containers don't share binaries.** Never reference host tools like `docker` inside a container entrypoint.

---

## References

- [Let's Encrypt — How it works](https://letsencrypt.org/how-it-works/)
- [nginx `return` directive documentation](https://nginx.org/en/docs/http/ngx_http_rewrite_module.html#return)
- [Certbot deploy hooks](https://eff-certbot.readthedocs.io/en/stable/using.html#pre-and-post-validation-hooks)
