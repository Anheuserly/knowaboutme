# Database Specification — KnowAboutMe

KnowAboutMe uses **PostgreSQL 16** hosted at `vps.amcmep.in:5432/knowaboutme`. The schema is authored in Prisma and enforced via standard relational constraints, foreign keys, and indexes.

---

## 1. Relational Entities (24 Tables)

### User & Authentication
- `users`: Core account record, password hash, role (`user`, `admin`, `super_admin`), status (`active`, `suspended`, `deleted`), login timestamps.
- `audit_logs`: Records administrative and security events (role changes, account suspensions).

### Profile & Identity
- `profiles`: Primary identity container linked 1:1 with `users`. Contains `username`, `display_name`, `headline`, `short_bio`, `long_bio`, `profile_photo_url`, `cover_image_url`, `theme_id`, `accent_color`, `font_family`, `availability_status`, `is_verified`, and SEO fields.
- `profile_settings`: Privacy permissions (allow contact form, show email, show phone, allow search engine indexing, show live view count, maintenance mode).
- `profile_sections`: Modular section ordering and visibility toggle state (`is_visible`, `display_order`).

### Portfolio & Career Records
- `experiences`: Work history records (`company_name`, `position`, `start_date`, `end_date`, `is_current`, `company_url`, `description`, `location`).
- `education`: Academic achievements (`institution_name`, `degree`, `field_of_study`, `grade`, `dates`, `description`).
- `skills`: Competencies with proficiency percentages (0-100) and years of experience.
- `projects`: Featured work with live demo URL, GitHub source URL, tech tags, and description.
- `artwork`: Creative gallery items with high-res image URL, external link, and license.
- `galleries` & `gallery_items`: Multi-item visual media collections.
- `publications`: Published books, academic papers, and articles.
- `certifications`: Professional licenses and credential IDs.

### Life, Community & Interaction
- `hobbies`: Personal interests and activities outside work.
- `interests`: Topics of fascination and inquiry.
- `achievements`: Awards, honors, and recognitions with conferring organization.
- `testimonials`: Endorsements and client recommendations with approval state.
- `timeline_events`: Chronological milestones across personal and professional journey.
- `custom_sections`: Extensible arbitrary sections for bespoke user requirements.
- `contact_messages`: Inquiries delivered from public contact forms without exposing the owner's email address.
- `profile_views`: Privacy-conscious visit counter tracking timestamp, referrer, and device type.

---

## 2. Prisma Commands & Database Operations

```bash
# Push schema updates to the PostgreSQL instance
npx prisma db push

# Re-generate the Prisma Client types
npx prisma generate

# Seed initial demo & administrator accounts
node prisma/seed.js

# Launch Prisma Studio interactive database browser
npx prisma studio
```

---

## 3. Seed Accounts

| Account | Email | Password | Role | Public Profile |
| :--- | :--- | :--- | :--- | :--- |
| **Demo Creator** | `demo@knowaboutme.com` | `Demo@123456!` | `user` | `/@demo` |
| **Platform Admin** | `admin@knowaboutme.com` | `Admin@123456!` | `admin` | `/@admin` |
