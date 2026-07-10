import type { NextConfig } from "next";

// output: 'export' produces a static `out/` folder with no Node server required.
// This single build is what gets: (1) deployed to Vercel as-is, (2) wrapped by
// Tauri for desktop, (3) served as an installable PWA for mobile.
// Tradeoff: no Next.js middleware, no API routes, no ISR — every API call goes
// client-side straight to the Spring Boot backend. That's the correct shape
// here since there's no SSR dependency on the backend's data.
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // static export can't use the Next.js Image Optimization API
  }, // avoids 404s on static hosts / Tauri's local file server
};

export default nextConfig;
