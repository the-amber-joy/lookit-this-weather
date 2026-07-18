import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

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
      const contents = `commit: ${commit}\nbuilt: ${new Date().toISOString()}\n`;
      writeFileSync(resolve(__dirname, "dist/build.txt"), contents);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    buildInfo(),
    VitePWA({
      registerType: "autoUpdate",
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
        start_url: "/",
        scope: "/",
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
      },
    }),
  ],
});
