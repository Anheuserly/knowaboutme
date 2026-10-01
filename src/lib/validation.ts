import { z } from "zod";

export const RESERVED_USERNAMES = [
  "admin",
  "administrator",
  "api",
  "app",
  "dashboard",
  "login",
  "register",
  "settings",
  "support",
  "help",
  "about",
  "contact",
  "privacy",
  "terms",
  "pricing",
  "demo",
  "u",
  "user",
  "profile",
];

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(
    /^[a-z0-9_-]+$/,
    "Username can only contain lowercase letters, numbers, hyphens, and underscores"
  )
  .refine(
    (val) => !RESERVED_USERNAMES.includes(val.toLowerCase()) || val.toLowerCase() === "demo",
    {
      message: "This username is reserved and cannot be claimed.",
    }
  );

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  username: usernameSchema,
  displayName: z.string().min(2, "Display name must be at least 2 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z.object({
  display_name: z.string().min(2).max(100).optional(),
  headline: z.string().max(200).optional().nullable(),
  profile_type: z.string().max(50).optional().nullable(),
  short_bio: z.string().optional().nullable(),
  long_bio: z.string().optional().nullable(),
  profile_photo_url: z.string().url().optional().nullable().or(z.literal("")),
  cover_image_url: z.string().url().optional().nullable().or(z.literal("")),
  location: z.string().max(100).optional().nullable(),
  website_url: z.string().url().optional().nullable().or(z.literal("")),
  pronouns: z.string().max(50).optional().nullable(),
  availability_status: z.string().max(100).optional().nullable(),
  theme_id: z.string().max(50).optional(),
  accent_color: z.string().max(20).optional(),
  font_family: z.string().max(30).optional(),
  seo_title: z.string().max(200).optional().nullable(),
  seo_description: z.string().optional().nullable(),
});

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(150),
  email: z.string().email("Valid email is required"),
  subject: z.string().max(255).optional(),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});
