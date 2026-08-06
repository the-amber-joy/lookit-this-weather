import packageJson from "../package.json";

export const APP_VERSION = packageJson.version;

export interface ChangelogEntry {
  version: string;
  date: string;
  notes: string[];
}

// Newest first. Add an entry here (and bump the version in package.json)
// whenever a user-facing change ships.
export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "1.1.0",
    date: "2026-08-06",
    notes: [
      "Added a Synthwave theme, with separate day and night modes.",
      "Added a CSS horizon grid background for the Synthwave theme.",
    ],
  },
  {
    version: "1.0.0",
    date: "2026-07-24",
    notes: [
      "Initial public release.",
      "Default & Fairycore themes, with day/night modes.",
    ],
  },
];
