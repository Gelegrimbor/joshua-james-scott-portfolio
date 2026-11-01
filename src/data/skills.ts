/**
 * skills.ts — typed skill groups (rendered as grouped mono chips).
 *
 * To add a group or item: edit the SKILL_GROUPS array below — it's type-checked.
 */

export interface SkillGroup {
  /** Group heading, e.g. "Frontend". */
  area: string;
  items: string[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    area: "Frontend",
    items: [
      "TypeScript",
      "JavaScript",
      "React",
      "Next.js",
      "React Native (Expo)",
      "Tailwind CSS",
      "Bootstrap 5",
      "Astro",
      "HTML/CSS",
    ],
  },
  {
    area: "Backend & Infra",
    items: [
      "Laravel",
      "PHP",
      "Node.js",
      "Express",
      "CodeIgniter 4",
      "MySQL",
      "PostgreSQL",
      "Supabase",
      "Firebase",
      "Google Cloud",
      "Docker",
      "Linux",
      "Cloudflare Zero Trust",
      "Vercel",
    ],
  },
  {
    area: "Automation & AI",
    items: [
      "n8n",
      "Zapier",
      "Claude API",
      "Claude Vision",
      "Gemini",
      "TTS APIs",
      "Meta Graph API",
      "SendGrid",
      "Xero API",
      "prompt engineering",
      "Claude Code",
    ],
  },
  {
    area: "Tools & CMS",
    items: [
      "WordPress",
      "Elementor",
      "Contact Form 7",
      "Google Ad Manager",
      "Google Workspace APIs",
      "Git",
      "SSH/SFTP",
    ],
  },
];
