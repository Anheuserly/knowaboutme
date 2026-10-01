export type PublicProfile = {
  id: string;
  username: string;
  display_name: string;
  headline?: string | null;
  profile_type?: string | null;
  short_bio?: string | null;
  long_bio?: string | null;
  profile_photo_url?: string | null;
  cover_image_url?: string | null;
  location?: string | null;
  website_url?: string | null;
  pronouns?: string | null;
  availability_status?: string | null;
  is_verified: boolean;
  theme_id?: string | null;
  accent_color?: string | null;
  font_family?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  created_at: string;
  settings?: {
    show_email: boolean;
    show_phone: boolean;
    allow_contact: boolean;
    show_social_links: boolean;
    show_location: boolean;
    show_view_count: boolean;
  } | null;
  social_links: Array<{
    id: string;
    platform: string;
    label?: string | null;
    username?: string | null;
    url: string;
    icon?: string | null;
    is_verified: boolean;
    display_order: number;
  }>;
  experiences: Array<{
    id: string;
    company_name: string;
    position: string;
    description?: string | null;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    is_current: boolean;
    company_url?: string | null;
    company_logo_url?: string | null;
  }>;
  education: Array<{
    id: string;
    institution_name: string;
    degree?: string | null;
    field_of_study?: string | null;
    description?: string | null;
    location?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    grade?: string | null;
    institution_url?: string | null;
  }>;
  skills: Array<{
    id: string;
    name: string;
    category?: string | null;
    proficiency?: number | null;
    years_experience?: number | null;
  }>;
  projects: Array<{
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    role?: string | null;
    technologies?: any;
    project_url?: string | null;
    github_url?: string | null;
    cover_image_url?: string | null;
  }>;
  artwork: Array<{
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    image_url?: string | null;
    external_url?: string | null;
    creation_date?: string | null;
    license?: string | null;
  }>;
  hobbies: Array<{
    id: string;
    name: string;
    description?: string | null;
    icon?: string | null;
    image_url?: string | null;
  }>;
  interests: Array<{
    id: string;
    name: string;
    category?: string | null;
    description?: string | null;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description?: string | null;
    organization?: string | null;
    achievement_date?: string | null;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role?: string | null;
    company?: string | null;
    message: string;
    photo_url?: string | null;
    website_url?: string | null;
  }>;
  timeline_events: Array<{
    id: string;
    title: string;
    description?: string | null;
    event_date?: string | null;
    event_type?: string | null;
    external_url?: string | null;
  }>;
  sections_order?: Array<{
    section_type: string;
    display_order: number;
    is_visible: boolean;
  }>;
};
