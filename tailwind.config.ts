import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(0 0% 89%)",
        input: "hsl(0 0% 94%)",
        ring: "hsl(0 0% 30%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(0 0% 3.9%)",
        primary: {
          DEFAULT: "hsl(0 0% 9%)",
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "hsl(0 0% 96.3%)",
          foreground: "hsl(0 0% 9%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "hsl(0 0% 96.3%)",
          foreground: "hsl(0 0% 45.1%)",
        },
        accent: {
          DEFAULT: "hsl(0 0% 96.3%)",
          foreground: "hsl(0 0% 9%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(0 0% 3.9%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(0 0% 3.9%)",
        },
        // Luxury Simple Color Palette
        luxury: {
          50: "hsl(0, 0%, 98%)",   // Lightest
          100: "hsl(0, 0%, 94%)",  // Light
          200: "hsl(0, 0%, 89%)",  // Light Gray
          300: "hsl(0, 0%, 70%)",  // Medium Gray
          400: "hsl(0, 0%, 45%)",  // Dark Gray
          500: "hsl(0, 0%, 30%)",  // Darkest Gray
          accent: "hsl(40, 100%, 70%)", // Warm Gold
        },
        warm: {
          50: "#FEF7CD",   // Soft Yellow
          100: "#FEC6A1",  // Soft Orange
          200: "#FDE1D3",  // Soft Peach
          300: "#F97316",  // Bright Orange
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'warm-subtle': '0 4px 6px -1px rgba(249,115,22,0.1), 0 2px 4px -1px rgba(249,115,22,0.06)',
      },
      keyframes: {
        "fade-in": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        "slide-up": {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
