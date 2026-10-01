const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:AnheVps2022@vps.amcmep.in:5432/knowaboutme";

const pool = new Pool({ connectionString });

async function seed() {
  console.log("🌱 Starting KnowAboutMe database seeding...");
  const client = await pool.connect();

  try {
    // 1. Password hashes
    const demoPasswordHash = await bcrypt.hash("Demo@123456!", 10);
    const adminPasswordHash = await bcrypt.hash("Admin@123456!", 10);

    // 2. Create users
    const demoUserId = "a1111111-1111-4111-8111-111111111111";
    const adminUserId = "b2222222-2222-4222-8222-222222222222";

    await client.query(`
      INSERT INTO users (id, email, password_hash, role, status, email_verified_at, created_at, updated_at)
      VALUES 
        ($1, 'demo@knowaboutme.com', $2, 'user', 'active', NOW(), NOW(), NOW()),
        ($3, 'admin@knowaboutme.com', $4, 'super_admin', 'active', NOW(), NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role,
        status = 'active';
    `, [demoUserId, demoPasswordHash, adminUserId, adminPasswordHash]);

    console.log("✅ Users seeded (demo@knowaboutme.com & admin@knowaboutme.com)");

    // 3. Create demo profile for @demo
    const demoProfileId = "c3333333-3333-4333-8333-333333333333";

    await client.query(`
      INSERT INTO profiles (
        id, user_id, username, display_name, headline, profile_type,
        short_bio, long_bio, profile_photo_url, cover_image_url,
        location, website_url, pronouns, availability_status,
        profile_status, is_verified, theme_id, accent_color, font_family,
        seo_title, seo_description, created_at, updated_at
      ) VALUES (
        $1, $2, 'demo', 'Alex Morgan',
        'Principal Designer, Creative Technologist & Visual Storyteller',
        'creator',
        'Exploring the intersection of human psychology, tactile interface aesthetics, and generative systems.',
        'Over the past 12 years, I have helped early-stage ventures and global design ateliers distill complex technological frontiers into intuitive, human-centered experiences. Beyond interface architecture, I am deeply captivated by analog medium format photography, algorithmic sound synthesis, and mid-century editorial typography.',
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=80',
        'San Francisco, CA & Remote',
        'https://alexmorgan.design',
        'they/them',
        'Open for select advisory & keynote opportunities',
        'published', true, 'creative', '#6366f1', 'sans',
        'Alex Morgan | Personal Identity & Digital Portfolio',
        'Official KnowAboutMe identity profile of Alex Morgan - Designer, technologist, and visual author.',
        NOW(), NOW()
      )
      ON CONFLICT (username) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        headline = EXCLUDED.headline,
        short_bio = EXCLUDED.short_bio,
        long_bio = EXCLUDED.long_bio,
        profile_photo_url = EXCLUDED.profile_photo_url,
        cover_image_url = EXCLUDED.cover_image_url,
        theme_id = EXCLUDED.theme_id,
        is_verified = true;
    `, [demoProfileId, demoUserId]);

    console.log("✅ Profile @demo seeded");

    // 4. Profile settings
    await client.query(`
      INSERT INTO profile_settings (
        id, profile_id, show_email, show_phone, allow_contact,
        allow_indexing, show_social_links, show_location,
        enable_analytics, created_at, updated_at
      ) VALUES (
        gen_random_uuid(), $1, true, false, true, true, true, true, true, NOW(), NOW()
      )
      ON CONFLICT (profile_id) DO NOTHING;
    `, [demoProfileId]);

    // 5. Social Links
    await client.query(`DELETE FROM social_links WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO social_links (id, profile_id, platform, label, username, url, icon, display_order, is_visible, is_verified, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'GitHub', 'Open Source Projects', 'alexmorgan-dev', 'https://github.com', 'github', 1, true, true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'LinkedIn', 'Professional Network', 'in/alexmorgan-design', 'https://linkedin.com', 'linkedin', 2, true, true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'X', 'Design & Technology Thoughts', '@alexm_ux', 'https://x.com', 'twitter', 3, true, true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Instagram', 'Visual Arts & Photography', '@alexmorgan.visuals', 'https://instagram.com', 'instagram', 4, true, false, NOW(), NOW()),
        (gen_random_uuid(), $1, 'YouTube', 'Design Systems & Creative Coding', '@AlexMorganStudio', 'https://youtube.com', 'youtube', 5, true, true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Dribbble', 'Selected UI Explorations', 'alexmorgan', 'https://dribbble.com', 'dribbble', 6, true, false, NOW(), NOW())
    `, [demoProfileId]);

    // 6. Experiences
    await client.query(`DELETE FROM experiences WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO experiences (id, profile_id, company_name, position, description, location, start_date, end_date, is_current, company_url, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Horizon Cognitive Labs', 'Principal Product Designer & Partner', 'Leading the core product experience and generative creative workflows across web and spatial interfaces.', 'San Francisco, CA', '2023-01-01', NULL, true, 'https://horizonlabs.ai', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Stripe Studio', 'Senior Interaction Designer', 'Spearheaded global developer platform navigation and localized checkout micro-interactions across 45 countries.', 'San Francisco, CA', '2020-04-01', '2022-12-31', false, 'https://stripe.com', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'MetaDesign Berlin', 'UI Lead & Brand Architect', 'Delivered unified brand identity guidelines and responsive design systems for European enterprise clients.', 'Berlin, Germany', '2017-06-01', '2020-03-31', false, 'https://metadesign.com', 3, NOW(), NOW())
    `, [demoProfileId]);

    // 7. Education
    await client.query(`DELETE FROM education WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO education (id, profile_id, institution_name, degree, field_of_study, description, location, start_date, end_date, grade, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Stanford University', 'Bachelor of Science (B.S.)', 'Symbolic Systems (Human-Computer Interaction)', 'Focus on cognitive psychology, interactive digital systems, and visual communication.', 'Palo Alto, CA', '2013-09-01', '2017-06-15', '3.92 GPA (Honors)', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Rhode Island School of Design', 'Summer Fellowship', 'Digital Media & Experimental Typography', 'Intensive studio residency exploring dynamic typography in web interfaces.', 'Providence, RI', '2016-06-01', '2016-08-31', 'Distinction', 2, NOW(), NOW())
    `, [demoProfileId]);

    // 8. Skills
    await client.query(`DELETE FROM skills WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO skills (id, profile_id, name, category, proficiency, years_experience, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Design Systems Architecture', 'Design', 95, 8.5, 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Next.js & React App Router', 'Engineering', 90, 6.0, 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'TypeScript & Modern Node.js', 'Engineering', 88, 5.5, 3, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Interactive Motion & Framer Motion', 'Design', 92, 7.0, 4, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Figma & Token Architecture', 'Design', 98, 9.0, 5, NOW(), NOW()),
        (gen_random_uuid(), $1, 'PostgreSQL Database Modeling', 'Engineering', 85, 4.5, 6, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Creative Direction & Brand Identity', 'Creative', 94, 8.0, 7, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Three.js & WebGL Visuals', 'Creative', 80, 3.5, 8, NOW(), NOW())
    `, [demoProfileId]);

    // 9. Projects
    await client.query(`DELETE FROM projects WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO projects (id, profile_id, name, slug, description, role, technologies, project_url, github_url, cover_image_url, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Aura UI Design System', 'aura-ui-system', 'An open-source accessible component library built for tactile aesthetic harmony, micro-interactions, and dark mode vibrancy.', 'Creator & Maintainer', '["TypeScript", "React", "Tailwind CSS", "Radix UI"]', 'https://aura-ui.dev', 'https://github.com/alexmorgan/aura-ui', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=900&q=80', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Chronos Spatial Sound Synthesizer', 'chronos-spatial-audio', 'A WebAudio synthesizer utilizing WebGL orbital nodes to sculpt ambient sonic landscapes in multi-channel dimensional audio.', 'Lead Designer & Engineer', '["Three.js", "Web Audio API", "WebAssembly"]', 'https://chronos-audio.live', 'https://github.com/alexmorgan/chronos', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Atelier Minimal Journal', 'atelier-minimal-journal', 'A local-first, distraction-free markdown journal designed for contemplative writers and authors.', 'Product Architect', '["Next.js", "IndexedDB", "Tailwind CSS"]', 'https://atelier-journal.app', 'https://github.com/alexmorgan/atelier', 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80', 3, NOW(), NOW())
    `, [demoProfileId]);

    // 10. Artwork
    await client.query(`DELETE FROM artwork WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO artwork (id, profile_id, title, description, category, image_url, creation_date, license, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Ethereal Horizons #04', 'Generative architectural gradient study captured using procedural raymarching and chromatic dispersion.', 'Generative 3D', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80', '2025-11-12', 'CC BY-NC 4.0', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Monolith in Obsidian', 'Tactile ceramic sculpture rendered with light interference and volumetric caustics.', 'Sculpture & 3D', 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=900&q=80', '2025-08-20', 'All Rights Reserved', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Neon Nocturne', 'Long-exposure medium format film capture of Shinjuku rainy reflections at midnight.', 'Film Photography', 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80', '2024-10-04', 'CC BY-ND 4.0', 3, NOW(), NOW())
    `, [demoProfileId]);

    // 11. Hobbies & Interests
    await client.query(`DELETE FROM hobbies WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO hobbies (id, profile_id, name, description, icon, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Medium Format Film Photography', 'Shooting on Hasselblad 500C/M with Kodak Portra 400 across coastal California and Japan.', 'Camera', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Ceramic Pottery & Glazing', 'Wheel-thrown stoneware vessels emphasizing organic wabi-sabi textures and ash glazes.', 'Sparkles', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Ultrarunning & Trail Trekking', 'Exploring remote mountain ridges and endurance 50k trails throughout the Sierra Nevada.', 'Compass', 3, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Modular Eurorack Synthesis', 'Patching analog oscillators and resonant filters to build evolving ambient textures.', 'Music', 4, NOW(), NOW())
    `, [demoProfileId]);

    await client.query(`DELETE FROM interests WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO interests (id, profile_id, name, category, description, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Brutalist Architecture', 'Architecture', 'The honest materiality of exposed cast concrete and bold geometric forms.', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Typefoundry Craft', 'Typography', 'Optical sizes, ink traps, and the historical mechanics of Swiss international typography.', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Human Factors & Ergonomics', 'Science', 'How tactile feedback and spatial layout reduce cognitive load in digital environments.', 3, NOW(), NOW())
    `, [demoProfileId]);

    // 12. Achievements
    await client.query(`DELETE FROM achievements WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO achievements (id, profile_id, title, description, organization, achievement_date, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Fast Company Innovation by Design Award 2025', 'Awarded for exceptional clarity in accessible human-centered digital experiences.', 'Fast Company', '2025-09-18', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Awwwards Site of the Month & Developer Award', 'Recognized for pioneering WebGL micro-interactions and performance excellence.', 'Awwwards', '2024-05-10', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, '100k+ Open Source Component Downloads', 'Milestone achieved across community npm packages and UI component kits.', 'GitHub Open Source', '2025-01-15', 3, NOW(), NOW())
    `, [demoProfileId]);

    // 13. Testimonials
    await client.query(`DELETE FROM testimonials WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO testimonials (id, profile_id, name, role, company, message, photo_url, display_order, is_approved, is_visible, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Dr. Elena Vance', 'VP of Product Experience', 'Horizon Cognitive Labs', 'Alex has that exceptionally rare dual gift: the poetic sensibility of a master artist and the rigorous analytical discipline of a systems engineer. Working with Alex fundamentally redefined our product trajectory.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80', 1, true, true, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Marcus Sterling', 'Managing Partner', 'Apex Ventures & Atelier Capital', 'Whenever our portfolio companies need transformative product architecture and unmistakable aesthetic identity, Alex Morgan is the very first phone call we make. Truly peerless execution.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 2, true, true, NOW(), NOW())
    `, [demoProfileId]);

    // 14. Timeline Events
    await client.query(`DELETE FROM timeline_events WHERE profile_id = $1`, [demoProfileId]);
    await client.query(`
      INSERT INTO timeline_events (id, profile_id, title, description, event_date, event_type, display_order, created_at, updated_at)
      VALUES
        (gen_random_uuid(), $1, 'Founded Studio Morgan Atelier', 'Launched independent design consulting practice serving high-growth technology startups.', '2018-03-01', 'Career', 1, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Relocated to Berlin for MetaDesign Residency', 'Immersed in European type foundries and Bauhaus design foundations.', '2019-06-01', 'Milestone', 2, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Keynote at Design Matters Tokyo', 'Delivered plenary talk on "Tactile Digital Materiality in the Age of Spatial Computing".', '2024-11-20', 'Speaking', 3, NOW(), NOW()),
        (gen_random_uuid(), $1, 'Launched KnowAboutMe Platform', 'Established unified personal identity and public biographical portfolio.', '2026-01-10', 'Launch', 4, NOW(), NOW())
    `, [demoProfileId]);

    // 15. Profile Sections (Visibility & Ordering)
    await client.query(`DELETE FROM profile_sections WHERE profile_id = $1`, [demoProfileId]);
    const sections = [
      { type: "about", order: 1 },
      { type: "experience", order: 2 },
      { type: "projects", order: 3 },
      { type: "skills", order: 4 },
      { type: "artwork", order: 5 },
      { type: "education", order: 6 },
      { type: "achievements", order: 7 },
      { type: "timeline", order: 8 },
      { type: "testimonials", order: 9 },
      { type: "hobbies", order: 10 },
      { type: "social_links", order: 11 },
      { type: "contact", order: 12 },
    ];

    for (const sec of sections) {
      await client.query(`
        INSERT INTO profile_sections (id, profile_id, section_type, display_order, is_visible, configuration, created_at, updated_at)
        VALUES (gen_random_uuid(), $1, $2, $3, true, '{}', NOW(), NOW())
      `, [demoProfileId, sec.type, sec.order]);
    }

    console.log("✅ Profile sections configured");
    console.log("🎉 KnowAboutMe database seeding finished successfully!");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    throw error;
  } finally {
    client.release();
    pool.end();
  }
}

seed().catch(() => process.exit(1));
