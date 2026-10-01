# Deployment Guide — Cloudflare Workers & Wrangler

KnowAboutMe is configured for deployment on **Cloudflare Workers** using the official Next.js 15 adapter [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare) and **Wrangler**.

---

## 1. Wrangler Configurations

Both `wrangler.jsonc` and `wrangler.toml` are maintained in the repository root to ensure compatibility across all Cloudflare build tools and environments.

### `wrangler.jsonc`
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "main": ".open-next/worker.js",
  "name": "knowaboutme",
  "compatibility_date": "2026-06-29",
  "compatibility_flags": ["nodejs_compat", "global_fetch_strictly_public"],
  "assets": {
    "directory": ".open-next/assets",
    "binding": "ASSETS"
  },
  "build": {
    "command": "test -f .open-next/worker.js || npm run build"
  },
  "services": [
    {
      "binding": "WORKER_SELF_REFERENCE",
      "service": "knowaboutme"
    }
  ],
  "images": {
    "binding": "IMAGES"
  },
  "observability": {
    "enabled": true
  },
  "vars": {
    "DATABASE_URL": "postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/knowaboutme",
    "JWT_SECRET": "knowaboutme_super_secret_jwt_key_2026_identity_vault",
    "NEXT_PUBLIC_APP_URL": "https://knowaboutme.amcmep.in"
  }
}
```

### `wrangler.toml`
```toml
name = "knowaboutme"
main = ".open-next/worker.js"
compatibility_date = "2026-06-29"
compatibility_flags = ["nodejs_compat", "global_fetch_strictly_public"]

[assets]
directory = ".open-next/assets"
binding = "ASSETS"

[build]
command = "test -f .open-next/worker.js || npm run build"

[[services]]
binding = "WORKER_SELF_REFERENCE"
service = "knowaboutme"

[images]
binding = "IMAGES"

[observability]
enabled = true

[vars]
DATABASE_URL = "postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/knowaboutme"
JWT_SECRET = "knowaboutme_super_secret_jwt_key_2026_identity_vault"
NEXT_PUBLIC_APP_URL = "https://knowaboutme.amcmep.in"
```

---

## 2. Cloudflare Dashboard Settings

When setting up your Worker / Pages project in the Cloudflare Dashboard:

| Setting | Value |
| :--- | :--- |
| **Framework preset** | None / OpenNext |
| **Root directory** | `/` |
| **Build command** | `npm run build` |
| **Build output directory** | *(Managed by OpenNext: `.open-next/assets`)* |
| **Deploy command** | `npx wrangler deploy` |

### Environment Variables
Configure these under **Settings > Variables and Secrets**:

| Variable | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/knowaboutme` | PostgreSQL connection string |
| `JWT_SECRET` | `knowaboutme_super_secret_jwt_key_2026_identity_vault` | Secure 32+ character JWT secret |
| `NEXT_PUBLIC_APP_URL` | `https://knowaboutme.amcmep.in` | Canonical public application URL |

---

## 3. Local Development & Preview Commands

```bash
# Start Next.js local development server (port 3002)
npm run dev

# Build the Cloudflare OpenNext bundle
npm run build

# Preview locally on Cloudflare workerd runtime
npm run preview

# Deploy directly via Wrangler
npm run deploy
```

---

## 4. Custom Domains & Routing

- The platform rewrites `/@:username` to `/u/:username` automatically via `next.config.mjs`.
- Custom domain `knowaboutme.amcmep.in` should be mapped as a **Custom Domain** under the Cloudflare Worker settings.
