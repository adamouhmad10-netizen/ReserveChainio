import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#07111D",
        carbon: "#0B1520",
        surface: "#101D29",
        surface2: "#162431",
        panel: "#192A37",
        ink: "#F4F6F7",
        "ink-2": "#ADB7C0",
        muted: "#788591",
        line: "rgba(191, 203, 213, 0.14)",
        copper: { DEFAULT: "#C87943", light: "#E29A64", dark: "#784528" },
        nickel: { DEFAULT: "#BCC5CD", mid: "#87939D", dark: "#505D68" },
        gold: "#C8A349",
        ok: "#4E9874",
        warn: "#C3984B",
        crit: "#C46B68",
        info: "#628EAD",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter-tight)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: { shell: "80rem" },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadein: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
      },
      animation: {
        rise: "rise 420ms cubic-bezier(0.22,1,0.36,1) both",
        fadein: "fadein 300ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
