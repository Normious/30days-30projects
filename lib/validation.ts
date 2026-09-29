import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(280),
  long_description: z.string().optional(),
  screenshot_url: z.string().url(),
  demo_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")),
  source_snippet: z.string().optional(),
  source_language: z.string().optional(),
  tech_stack: z.array(z.string()).default([]),
  category: z.string().optional(),
  challenge_id: z.string().uuid().optional().nullable(),
  day_number: z.number().int().min(1).max(365).optional().nullable(),
});

export const challengeSchema = z.object({
  title: z.string().min(1).max(200),
  tagline: z.string().max(200).optional(),
  description: z.string().optional(),
  rules: z.string().optional(),
  hero_image_url: z.string().url().optional().or(z.literal("")),
  start_date: z.string(),
  end_date: z.string(),
  registration_mode: z.enum(["public", "invite_only"]).default("public"),
});

export const organiserApplicationSchema = z.object({
  motivation: z.string().min(100).max(2000),
  planned_challenge_title: z.string().min(5).max(120),
  planned_challenge_description: z.string().min(50).max(2000),
  planned_start_date: z.string(),
  planned_end_date: z.string(),
  expected_participants: z.number().int().min(1).max(10000).optional(),
  previous_experience: z.string().max(1000).optional(),
  portfolio_url: z.string().url().optional().or(z.literal("")),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  community_references: z.string().max(500).optional(),
});

export const profileSchema = z.object({
  display_name: z.string().min(1).max(100),
  bio: z.string().max(500).optional(),
  linkedin_url: z.string().url().optional().or(z.literal("")),
  github_url: z.string().url().optional().or(z.literal("")),
  twitter_url: z.string().url().optional().or(z.literal("")),
  website_url: z.string().url().optional().or(z.literal("")),
  location: z.string().max(100).optional(),
});

export type ProjectInput = z.infer<typeof projectSchema>;
export type ChallengeInput = z.infer<typeof challengeSchema>;
export type OrganiserApplicationInput = z.infer<typeof organiserApplicationSchema>;
