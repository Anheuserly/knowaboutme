# Features & Capabilities Guide — KnowAboutMe

KnowAboutMe was built around the principle of **"One person, one identity, one customizable profile, one shareable URL"**.

---

## 1. The 9 Curated Themes

Every theme alters backgrounds, surface cards, typography scales, border accents, and badge styling to match diverse creator personas:

| Theme ID | Name | Aesthetic & Style | Best For |
| :--- | :--- | :--- | :--- |
| `minimal` | **Minimal** | Ultra-clean whitespace, high-contrast monochrome | Writers, executives, general identity |
| `professional` | **Professional** | Executive navy and slate corporate palette | Consultants, corporate directors |
| `creative` | **Creative** | Deep dark indigo background with glowing highlights | Developers, creative technologists |
| `elegant` | **Elegant** | Warm ivory serif styling with luxury gold accents | Architects, authors, journalists |
| `modern` | **Modern** | High-contrast geometric layout with emerald accents | Founders, product managers |
| `portfolio` | **Portfolio** | Visual-first imagery with warm stone contrast | Visual artists, photographers |
| `editorial` | **Editorial** | Classic magazine columns with literary rhythm | Scholars, academics, researchers |
| `dark` | **Dark OLED** | Pure `#000000` pitch black theme with monospace fonts | Software engineers, terminal enthusiasts |
| `glass` | **Glassmorphism** | Frosted-glass translucent blur panels with gradients | Digital creators, Web3 builders |

Users can customize any theme by choosing custom accent colors and typeface styles (Sans-Serif, Serif, Monospace).

---

## 2. Instant Identity Sharing

### Digital Business Card (.vcf vCard)
Clicking **Share > Download Contact Card** downloads a standard `.vcf` file containing:
- Full display name
- Title / Headline
- Website URL & Public Profile URL
- Pronouns & Location
- Direct address book importing on iOS, Android, macOS, and Outlook.

### High-Resolution QR Code
Generates a scannable QR code linking directly to `https://knowaboutme.amcmep.in/@username` for networking at events and conferences.

### Direct Social Icons
Pre-built brand icons for 23 platforms including GitHub, LinkedIn, Twitter/X, Instagram, YouTube, Threads, TikTok, Dribbble, Behance, Spotify, Discord, and Telegram.

---

## 3. Privacy-Preserving Inquiries

- Visitors can send inquiries directly from the public profile.
- Messages are stored securely in the user's dashboard at `/dashboard/messages`.
- The profile owner's real email address is **never exposed** to the public or scrapers.

---

## 4. Platform Administration & Verification

- Administrators can access `/admin`.
- Identity verification badges (`is_verified`) can be toggled on/off.
- Malicious or spam accounts can be suspended immediately.
