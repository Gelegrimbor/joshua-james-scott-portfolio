/**
 * experience.ts — typed career log (rendered as a vertical timeline).
 *
 * Newest first — array order is display order.
 * To add/remove a role: edit the EXPERIENCE array below — it's type-checked.
 */

export interface ExperienceEntry {
  role: string;
  company: string;
  location: string;
  /** Display strings (e.g. "Jan 2024"). Kept as strings for easy editing. */
  startDate: string;
  /** Use "Present" for a current role. */
  endDate: string;
  bullets: string[];
  stack: string[];
}

export const EXPERIENCE: ExperienceEntry[] = [
  {
    role: "AI & Automation Specialist",
    company: "Media Prima Audio (Audio+)",
    location: "Kuala Lumpur",
    startDate: "Jan 2026",
    endDate: "Present",
    bullets: [
      "Built ~15 production n8n workflows for a podcast studio's booking operations, covering guest clearance, dynamic forms, multi-stakeholder email routing, 24-hour reminders, retargeting and error monitoring with manual-recovery fallbacks.",
      "Enhanced an Instagram DM automation into a two-stage conversation flow on Meta Graph API webhooks, with a Google Sheets control panel so non-technical staff can run campaigns without code.",
      "Maintain and update WordPress/Elementor sites for 5 radio stations, including full station rebrands and redesigns.",
      "Built 10+ competition, campaign and event registration forms with Contact Form 7, with PDPA consent, duplicate-entry blocking and Google Sheets logging.",
      "Rolled out site-wide changes to 5 high-traffic station websites on Google Cloud by reimaging autoscaling instance groups with zero downtime.",
      "Manage plugins, ad placements (Google Ad Manager) and server email configuration across production sites and Linux servers.",
    ],
    stack: [
      "n8n",
      "Laravel",
      "WordPress",
      "Google Cloud",
      "Meta Graph API",
      "Claude API",
    ],
  },
  {
    role: "Frontend JS Developer Intern",
    company: "Studio20",
    location: "Kuala Lumpur",
    startDate: "Sep 2025",
    endDate: "Jan 2026",
    bullets: [
      "Built an AI invoice automation (Zapier, AI PDF extraction, Xero API) routing supplier invoices across 6 company entities, saving ~23 hours/month of manual finance work at a ~95% automation rate.",
      "Built a SuperAdmin Schools Management feature (full CRUD, validation, role-based permissions) in React, TypeScript and Next.js.",
      "Developed a React Native (Expo) fitness app homepage with custom progress components and tab navigation.",
    ],
    stack: [
      "React",
      "TypeScript",
      "Next.js",
      "React Native",
      "Zapier",
      "Xero API",
    ],
  },
  {
    role: "Production Crew / Technology & Sourcing Coordinator",
    company: "Memories Entertainment",
    location: "Selangor",
    startDate: "Aug 2023",
    endDate: "Jul 2024",
    bullets: [
      "Coordinated technical setup for 12+ nationwide live events, managing vendors and equipment and providing on-site sound, lighting and network support.",
    ],
    stack: ["Live events", "AV", "Networking"],
  },
];
