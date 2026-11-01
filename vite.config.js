import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "၅ ပေ ၉ လက်မ ပိုက်ကျော် ပြိုင်ပွဲ",
        short_name: "ပိုက်ကျော် ၅'၉",
        description: "အုပ်စု Table၊ ပွဲစဉ်နှင့် Final",
        theme_color: "#0E3B2E",
        background_color: "#F2F4F1",
        display: "standalone",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      }
    })
  ]
});
