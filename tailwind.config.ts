import type { Config } from "tailwindcss";

// Every value here resolves to a CSS variable defined in src/styles/tokens.css —
// nothing is inlined as a raw hex/px here. That keeps tokens.css as the single
// source of truth (per the design doc's "use token refs everywhere" rule) and
// means a future dark-mode pass only touches one file.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-focus": "var(--color-primary-focus)",
        "primary-on-dark": "var(--color-primary-on-dark)",
        ink: "var(--color-ink)",
        "ink-muted-80": "var(--color-ink-muted-80)",
        "ink-muted-48": "var(--color-ink-muted-48)",
        "body-muted": "var(--color-body-muted)",
        "divider-soft": "var(--color-divider-soft)",
        hairline: "var(--color-hairline)",
        canvas: "var(--color-canvas)",
        "canvas-parchment": "var(--color-canvas-parchment)",
        "surface-pearl": "var(--color-surface-pearl)",
        "surface-tile-1": "var(--color-surface-tile-1)",
        "surface-tile-2": "var(--color-surface-tile-2)",
        "surface-tile-3": "var(--color-surface-tile-3)",
        "surface-black": "var(--color-surface-black)",
        "surface-chip": "var(--color-surface-chip-translucent)",
        "on-primary": "var(--color-on-primary)",
        "on-dark": "var(--color-on-dark)",
        // Status-pill extension — never used for buttons/links, status semantics only.
        "status-saved": "var(--color-status-saved)",
        "status-applied": "var(--color-status-applied)",
        "status-interview": "var(--color-status-interview)",
        "status-offer": "var(--color-status-offer)",
        "status-rejected": "var(--color-status-rejected)",
        "status-withdrawn": "var(--color-status-withdrawn)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        text: ["var(--font-text)"],
      },
      fontSize: {
        "hero-display": ["56px", { lineHeight: "1.07", letterSpacing: "-0.28px", fontWeight: "600" }],
        "display-lg": ["40px", { lineHeight: "1.10", letterSpacing: "0", fontWeight: "600" }],
        "display-md": ["34px", { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "600" }],
        lead: ["28px", { lineHeight: "1.14", letterSpacing: "0.196px", fontWeight: "400" }],
        "lead-airy": ["24px", { lineHeight: "1.5", letterSpacing: "0", fontWeight: "300" }],
        tagline: ["21px", { lineHeight: "1.19", letterSpacing: "0.231px", fontWeight: "600" }],
        "body-strong": ["17px", { lineHeight: "1.24", letterSpacing: "-0.374px", fontWeight: "600" }],
        body: ["17px", { lineHeight: "1.47", letterSpacing: "-0.374px", fontWeight: "400" }],
        "dense-link": ["17px", { lineHeight: "2.41", letterSpacing: "0", fontWeight: "400" }],
        caption: ["14px", { lineHeight: "1.43", letterSpacing: "-0.224px", fontWeight: "400" }],
        "caption-strong": ["14px", { lineHeight: "1.29", letterSpacing: "-0.224px", fontWeight: "600" }],
        "button-large": ["18px", { lineHeight: "1.0", letterSpacing: "0", fontWeight: "300" }],
        "button-utility": ["14px", { lineHeight: "1.29", letterSpacing: "-0.224px", fontWeight: "400" }],
        "fine-print": ["12px", { lineHeight: "1.0", letterSpacing: "-0.12px", fontWeight: "400" }],
      },
      borderRadius: {
        none: "0px",
        xs: "5px",
        sm: "8px",
        md: "11px",
        lg: "18px",
        pill: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "17px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "80px",
      },
      boxShadow: {
        // The ONE shadow the system allows — reserved for the funnel hero visual
        // and nothing else (never cards, buttons, or text). See design plan.
        product: "3px 5px 30px 0 rgba(0, 0, 0, 0.22)",
      },
      screens: {
        sm: "420px",
        lg2: "641px",
        tablet: "736px",
        "tablet-lg": "834px",
        "desktop-sm": "1024px",
        desktop: "1069px",
      },
    },
  },
  plugins: [],
};

export default config;
