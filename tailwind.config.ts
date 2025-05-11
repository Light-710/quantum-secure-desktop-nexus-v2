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
        background: "#F8F9FA",      // Off-White background
        foreground: "#2C3E50",      // Deep Navy text
        primary: {
          DEFAULT: "#2C3E50",       // Deep Navy primary
          foreground: "hsl(0 0% 98%)",
        },
        secondary: {
          DEFAULT: "#E9ECEF",       // Light Gray secondary
          foreground: "#2C3E50",    // Deep Navy text on secondary
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(0 0% 98%)",
        },
        muted: {
          DEFAULT: "#E9ECEF",       // Light Gray for muted components
          foreground: "#6c757d",    // Muted text 
        },
        accent: {
          DEFAULT: "#E9ECEF",       // Light Gray accent
          foreground: "#2C3E50",    // Deep Navy on accent
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "#2C3E50",    // Deep Navy text
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "#2C3E50",    // Deep Navy text
        },
        // Keep existing color groups but update key colors
        modern: {
          50: "#F8F9FA",   // Lightest - off-white
          100: "#E9ECEF",  // Light - light gray
          200: "#dee2e6",  // Light Gray
          300: "#ced4da",  // Medium Gray
          400: "#adb5bd",  // Dark Gray
          500: "#6c757d",  // Darkest Gray
          blue: "#2C3E50", // Primary Blue - deep navy
          teal: "#4aa3df", // Lighter blue accent
          green: "#2ecc71", // Green
          red: "#e74c3c",  // Red
          purple: "#9b59b6", // Purple
        },
        // Keep existing colors but not actively using
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
        cyber: {
          "dark": "#0f0f17",       // Dark background
          "dark-blue": "#121726",  // Darker blue background
          "blue": "#2C3E50",       // Updated to more modern blue
          "teal": "#4aa3df",       // Updated to more modern teal
          "green": "#2ecc71",      // Updated to more modern green
          "red": "#e74c3c",        // Updated to more modern red
          "purple": "#9b59b6",     // Updated to more modern purple
          "gray": "#9ca3af",       // Gray text
          "black": "#000000e6",    // Transparent black overlay
          "light": "#f8f8f8",      // Light text color
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
        'cyber-gradient': 'linear-gradient(to right, #f3f4f6, #ffffff)',
        'blue-gradient': 'linear-gradient(135deg, #E9ECEF 0%, #F8F9FA 100%)',
        'green-gradient': 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
        'light-gradient': 'linear-gradient(to right, #F8F9FA, #ffffff)',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)',
        'warm-subtle': '0 4px 6px -1px rgba(249,115,22,0.05), 0 2px 4px -1px rgba(249,115,22,0.03)',
        'blue-glow': '0 0 10px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.2)',
        'green-glow': '0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.2)',
      },
      keyframes: {
        "fade-in": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        "slide-up": {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        "scan-line": {
          '0%': { transform: 'translateY(-100vh)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        "glitch": {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        "pulse-glow": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' }
        }
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        "scan-line": "scan-line 4s linear infinite",
        "glitch": "glitch 0.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
