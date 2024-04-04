import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-login": "url('/resources/login-bg.webp')",
        "hero-register": "url('/resources/register-bg.webp')",
      },
    },
  },
  plugins: [],
} satisfies Config;
