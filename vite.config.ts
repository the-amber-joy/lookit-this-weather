import react from "@vitejs/plugin-react";
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

function buildInfo(): Plugin {
  return {
    name: "build-info",
    apply: "build",
    closeBundle() {
      let commit = "unknown";
      try {
        commit = execSync("git rev-parse --short HEAD").toString().trim();
      } catch {
        // git not available; leave as "unknown"
      }
      // Read directly instead of importing so this isn't affected by
      // resolveJsonModule/module settings applied to the app's TS build.
      const { version } = JSON.parse(
        readFileSync(resolve(__dirname, "package.json"), "utf-8"),
      ) as { version: string };
      // The update banner compares this against the running app's version to
      // decide whether a waiting service worker is actually user-facing.
      const contents = `commit: ${commit}\nbuilt: ${new Date().toISOString()}\nversion: ${version}\n`;
      writeFileSync(resolve(__dirname, "dist/build.txt"), contents);
    },
  };
}

// Lets CI build a copy for a subpath preview (e.g. /test/) without the
// default "/" used for the production (main) deployment.
const deployBase = process.env.DEPLOY_BASE || "/";

// https://vitejs.dev/config/
export default defineConfig({
  base: deployBase,
  plugins: [
    react(),
    buildInfo(),
    VitePWA({
      registerType: "prompt",
      injectRegister: false,
      includeAssets: [
        "favicon.ico",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "apple-touch-icon.png",
      ],
      manifest: {
        name: "Lookit This Weather",
        short_name: "Weather",
        description: "A simple current weather dashboard.",
        start_url: deployBase,
        scope: deployBase,
        display: "standalone",
        theme_color: "#09172a",
        background_color: "#09172a",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2}"],
        navigateFallbackDenylist: [/^\/build\.txt$/],
      },
    }),
  ],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
