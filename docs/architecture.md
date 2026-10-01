# System Architecture — KnowAboutMe

## Overview

KnowAboutMe is architected around the **Next.js 15 App Router** paired with Cloudflare Workers' globally distributed edge infrastructure via OpenNext.

```
                      ┌────────────────────────────────────────┐
                      │          Cloudflare CDN / Edge         │
                      └───────────────────┬────────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        │                                   │
              Static Assets (.open-next/assets)      Dynamic Worker (.open-next/worker.js)
                        │                                   │
                        │                        ┌──────────┴──────────┐
                        │                        │ Next.js App Router  │
                        │                        │ (Server Components, │
                        │                        │  Route Handlers)    │
                        │                        └──────────┬──────────┘
                        │                                   │ (Direct TCP via nodejs_compat)
                        │                                   ▼
                        │                        ┌─────────────────────┐
                        │                        │   PostgreSQL 16     │
                        │                        │ (vps.amcmep.in:5432)│
                        │                        └─────────────────────┘
```

---

## 1. Directory Structure

```
knowaboutme/
├── docs/                     # Architectural, deployment, and API documentation
├── prisma/
│   ├── schema.prisma         # Relational schema (24 models)
│   └── seed.js               # Database seeder (Demo & Admin accounts)
├── src/
│   ├── app/
│   │   ├── (auth)/           # Login and Register pages
│   │   ├── (marketing)/      # Home landing page with live interactive theme demo
│   │   ├── admin/            # Role-protected platform management console
│   │   ├── api/              # Secure REST Route Handlers (Auth, Profile, Sections, etc.)
│   │   ├── dashboard/        # Multi-tab user dashboard (Profile, Themes, Links, Inbox)
│   │   ├── u/[username]/     # Dynamic server-rendered public profile pages
│   │   ├── layout.tsx        # Root HTML layout with font injections
│   │   ├── sitemap.ts        # Dynamic sitemap.xml generator
│   │   └── robots.ts         # Dynamic robots.txt
│   ├── components/
│   │   ├── dashboard/        # Sidebar, top navigation, completeness cards
│   │   ├── marketing/        # Hero, interactive demo, feature blocks, footer
│   │   └── profile/          # Modular profile renderer, header, vCard modal, social icons
│   ├── lib/
│   │   ├── auth.ts           # JWT sign/verify, password hashing, session extraction
│   │   ├── db.ts             # Connection pooling via pg with Cloudflare socket support
│   │   ├── social-platforms.ts # Registry of 23 social networks & metadata
│   │   ├── themes.ts         # 9 Theme design systems
│   │   ├── utils.ts          # Class merging, date helpers, slug utilities
│   │   └── validation.ts     # Zod request validators
│   └── types/
│       └── profile.ts        # TypeScript data transfer object interfaces
├── next.config.mjs           # Next.js config & /@username rewrite rules
├── open-next.config.ts       # Cloudflare OpenNext bundler rules
├── wrangler.jsonc            # Cloudflare Worker JSONC specification
├── wrangler.toml             # Cloudflare Worker TOML specification
└── tailwind.config.ts        # Custom Tailwind utility rules
```

---

## 2. Authentication & Session Architecture

- **Session Tokens**: Signed JWTs containing user ID, email, role, profile ID, and username.
- **Storage**: `knowaboutme_session` stored as an `HttpOnly`, `SameSite=Lax`, `Secure` cookie with a 7-day expiration.
- **Password Security**: Passwords salted and hashed with `bcryptjs` (cost factor 10). Plaintext passwords are never persisted.
- **Role Hierarchy**:
  - `user`: Standard profile owner. Can edit own profile, themes, sections, and settings.
  - `admin` / `super_admin`: Has access to `/admin` to verify identities, suspend accounts, and view global metrics.

---

## 3. Database & Connection Layer

- Built on direct PostgreSQL connection pooling using `pg` with `nodejs_compat`.
- Connection timeout set to 8000ms with idle connection recycling to accommodate serverless lifecycles.
- Runtime does not require heavyweight native Node.js binaries, preventing workerd execution crashes.
