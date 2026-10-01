# KnowAboutMe — Personal Identity & Biography Platform

> **"Your story. Your world. Your identity."**

KnowAboutMe is a modern, high-performance personal identity platform built with Next.js 15 (App Router), React 19, Tailwind CSS, Prisma ORM, and PostgreSQL. It allows anyone to create a customizable, beautifully styled public identity page containing their biography, professional career, education, skills, projects, artwork, hobbies, achievements, testimonials, and milestones — shareable via a single URL at `knowaboutme.com/@username`.

---

## 🌟 Key Features

### 1. Unified Digital Identity
- **One person, one identity, one profile**: Accessible at either `knowaboutme.com/@username` or `/u/username`.
- **9 Curated Themes**:
  - *Minimal* — Ultra-clean whitespace & high-contrast typography
  - *Professional* — Slate & corporate executive presence
  - *Creative* — Modern dark indigo with dynamic glows
  - *Elegant* — Warm ivory serif editorial styling
  - *Modern* — High-contrast geometric layout with emerald accents
  - *Portfolio* — Visual-first design for designers & photographers
  - *Editorial* — Classic magazine column rhythm
  - *Dark OLED* — Pure pitch black optimized for developers
  - *Glassmorphism* — Frosted-glass translucent blur panels
- **Custom Accent Colors & Typography**: Tailor brand colors (Indigo, Emerald, Sky, Gold, Rose, etc.) and font systems (Sans-Serif, Serif, Monospace).

### 2. Modular Sections Architecture
- **Biographies**: Elevator pitch short bio + long narrative story.
- **Experience**: Work history, company URL, current role badge, rich descriptions.
- **Education**: Degrees, institutions, fields of study, honors.
- **Skills**: Categorized competencies with proficiency indicators.
- **Projects**: Portfolio gallery with live demo links, repository URLs, and tech tags.
- **Artwork & Media**: Creative works showcase with high-res imagery and licensing.
- **Hobbies & Interests**: Personal passions beyond professional achievements.
- **Achievements & Honors**: Conferred awards and credential verifications.
- **Testimonials**: Peer recommendations and client quotes.
- **Timeline & Milestones**: Chronological journey highlights.
- **Interactive Contact Form**: Direct visitor messaging without revealing your private email.

### 3. Identity Sharing
- **vCard Download**: Instant Contact Card (.vcf) download to add contact directly to iOS/Android address books.
- **QR Code Generator**: High-resolution scannable QR code modal.
- **URL Copy**: One-click clipboard copy.

### 4. Comprehensive Dashboard
- **Overview**: Profile completeness meter, recent inquiries, live view counts.
- **Profile Editor**: Display name, pronouns, availability badge ("Open to opportunities"), headline, avatar and cover banner URLs.
- **Appearance Studio**: Visual theme cards, custom color picker, and font toggles.
- **Social Links Manager**: Pre-configured registry for 23+ networks (GitHub, LinkedIn, Twitter/X, Instagram, YouTube, Threads, TikTok, Dribbble, Behance, Spotify, Discord, etc.) with handle prefix auto-formatting.
- **Portfolio & Section Manager**: Interactive management for all 9 profile sections with creation modal and delete actions.
- **Inquiries Inbox**: Filter by new/archived, preview message, one-click email reply, status toggles.
- **Privacy-Preserving Analytics**: 14-day traffic trend, top referrers, and device distribution (cookie-free, GDPR compliant).
- **Settings & Security**: Granular privacy controls (search engine indexing, hide/show email, profile status draft/published/private) and password update.

### 5. Administrative Console
- Accessible at `/admin` for administrators (`super_admin`, `admin`).
- Platform overview metrics (total users, published profiles, verified identities, aggregate views).
- Searchable user directory with instant account suspension/activation and verified identity badge toggles.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router, React 19)
- **Styling**: Tailwind CSS, PostCSS
- **Database & ORM**: PostgreSQL, Prisma ORM 6.19
- **Authentication**: JWT session tokens via HttpOnly cookies (`knowaboutme_session`) with bcryptjs password hashing
- **Validation**: Zod schema validation
- **Icons**: Lucide Icons & Custom SVG Brand SVGs
- **SEO & Structured Data**: Dynamic OpenGraph tags, Twitter cards, JSON-LD Person schema, dynamic `sitemap.xml` and `robots.txt`

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Anheuserly/knowaboutme.git
cd knowaboutme
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```env
DATABASE_URL="postgresql://username:password@host:5432/knowaboutme"
JWT_SECRET="your-ultra-secure-jwt-secret-key-32-chars-minimum"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Database Setup & Seed
```bash
npx prisma db push
node prisma/seed.js
```

Default seeded accounts:
- **Demo User**: `demo@knowaboutme.com` / `Demo@123456!` (Username: `@demo`)
- **Admin User**: `admin@knowaboutme.com` / `Admin@123456!`

### 5. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the marketing landing page or [http://localhost:3000/@demo](http://localhost:3000/@demo) to view the demo profile.

---

## 📦 Production Build
```bash
npm run build
npm run start
```
