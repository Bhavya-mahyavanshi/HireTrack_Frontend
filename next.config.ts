import type { NextConfig } from "next";

// NOTE: output: 'export' (static export) was removed at some point after
// the original build. This is now a standard server-rendered/SSR Next.js
// app deployed on Vercel — Vercel runs it as a Node server automatically,
// so dynamic routes like /applications/[id] work with zero extra config
// (no generateStaticParams needed, unlike the static-export setup).
//
// Tradeoff if you later want the Tauri desktop wrapper or a fully static
// PWA build: those need output: 'export' again, which brings back the
// requirement that every dynamic route export generateStaticParams(). If
// you re-add it, revisit src/app/(app)/applications/[id]/page.tsx.
const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // keeps behavior consistent regardless of hosting target
  },
  eslint: {
    // ESLint's flat-config resolution (eslint-config-next's
    // core-web-vitals/typescript exports) has been unreliable across
    // versions in Vercel's build environment — don't block production
    // builds on it. Run `npm run lint` locally for that feedback instead.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
