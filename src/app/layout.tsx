import type { Metadata, Viewport } from "next";
import { QueryProvider } from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "HireTrack",
    template: "%s · HireTrack",
  },
  description:
    "Track every application, surface skill gaps, and follow up on time — one place instead of twelve tabs.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HireTrack",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  // Prevents iOS from auto-zooming on input focus — critical for the Kanban
  // form UX on mobile where a zoom-in and zoom-out on every field tap is
  // disorienting. minimumScale: 1 keeps it readable without the zoom jank.
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                fontFamily: "var(--font-text)",
                fontSize: "14px",
                letterSpacing: "-0.224px",
                borderRadius: "11px",
                border: "1px solid var(--color-hairline)",
                background: "var(--color-canvas)",
                color: "var(--color-ink)",
              },
              classNames: {
                success:
                  "!border-[var(--color-status-offer)] !text-[var(--color-status-offer)]",
                error:
                  "!border-[var(--color-status-rejected)] !text-[var(--color-status-rejected)]",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
