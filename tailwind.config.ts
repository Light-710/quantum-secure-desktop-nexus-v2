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
        border: "#4A266A",       // Deep Purple for borders
        input: "#4A266A",        // Deep Purple for input borders
        ring: "#D946EF",         // Bright Purple for focus rings
        background: "#1E0B2F",   // Very Dark Purple background
        foreground: "#F5E8FF",   // Light Lavender text
        primary: {
          DEFAULT: "#D946EF",    // Bright Purple as primary
          foreground: "#FFFFFF", // White
        },
        secondary: {
          DEFAULT: "#3D1B54",    // Medium Purple as secondary
          foreground: "#F5E8FF", // Light Lavender text
        },
        destructive: {
          DEFAULT: "#FF4560",    // Bright Red
          foreground: "#FFFFFF", // White
        },
        muted: {
          DEFAULT: "#35144D",    // Dark Purple for muted areas
          foreground: "#CAB0EB", // Medium Lavender for muted text
        },
        accent: {
          DEFAULT: "#9333EA",    // Vibrant Purple for accents
          foreground: "#FFFFFF", // White
        },
        popover: {
          DEFAULT: "#280E3A",    // Dark Purple for popovers
          foreground: "#F5E8FF", // Light Lavender text
        },
        card: {
          DEFAULT: "#280E3A",    // Dark Purple for cards
          foreground: "#F5E8FF", // Light Lavender text
        },
        // Keep existing color groups but update with new dark purple/red palette
        modern: {
          50: "#280E3A",        // Dark Purple
          100: "#1E0B2F",       // Very Dark Purple
          200: "#3D1B54",       // Medium Purple
          300: "#CAB0EB",       // Medium Lavender
          400: "#F5E8FF",       // Light Lavender
          500: "#FFFFFF",       // White
          blue: "#9333EA",      // Vibrant Purple
          teal: "#D946EF",      // Bright Purple
          green: "#10B981",     // Emerald (keep for success)
          red: "#FF4560",       // Bright Red
          purple: "#A855F7",    // Light Purple
        },
        luxury: {
          50: "#1E0B2F",        // Very Dark Purple
          100: "#280E3A",       // Dark Purple
          200: "#3D1B54",       // Medium Purple
          300: "#CAB0EB",       // Medium Lavender
          400: "#F5E8FF",       // Light Lavender
          500: "#FFFFFF",       // White
          accent: "#D946EF",    // Bright Purple
        },
        warm: {
          50: "#1E0B2F",        // Very Dark Purple
          100: "#9333EA",       // Vibrant Purple
          200: "#D946EF",       // Bright Purple
          300: "#FF4560",       // Bright Red
        },
        cyber: {
          "dark": "#1E0B2F",       // Very Dark Purple
          "dark-blue": "#280E3A",  // Dark Purple
          "blue": "#9333EA",       // Vibrant Purple
          "teal": "#D946EF",       // Bright Purple
          "green": "#10B981",      // Emerald (keep for success)
          "red": "#FF4560",        // Bright Red
          "purple": "#A855F7",     // Light Purple
          "gray": "#CAB0EB",       // Medium Lavender
          "black": "#160823",      // Deep Dark Purple
          "light": "#F5E8FF",      // Light Lavender
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #1E0B2F 0%, #9333EA 100%)',
        'cyber-gradient': 'linear-gradient(to right, #1E0B2F, #280E3A)',
        'blue-gradient': 'linear-gradient(135deg, #280E3A 0%, #9333EA 100%)',
        'green-gradient': 'linear-gradient(135deg, #1E0B2F 0%, #D946EF 50%)',
        'light-gradient': 'linear-gradient(to right, #280E3A, #3D1B54)',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'warm-subtle': '0 4px 6px -1px rgba(139, 92, 246, 0.2), 0 2px 4px -1px rgba(139, 92, 246, 0.1)',
        'blue-glow': '0 0 10px rgba(139, 92, 246, 0.5), 0 0 20px rgba(139, 92, 246, 0.2)',
        'green-glow': '0 0 10px rgba(124, 58, 237, 0.5), 0 0 20px rgba(124, 58, 237, 0.2)',
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
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#F5E8FF', // Light Lavender for text
            a: {
              color: '#D946EF', // Bright Purple for links
              '&:hover': {
                color: '#FF4560', // Bright Red for hover
              },
            },
            h1: {
              color: '#FFFFFF', // White for headings
            },
            h2: {
              color: '#FFFFFF', // White for headings
            },
            h3: {
              color: '#FFFFFF', // White for headings
            },
            h4: {
              color: '#FFFFFF', // White for headings
            },
            code: {
              color: '#FF4560', // Bright Red for code
              backgroundColor: '#1E0B2F', // Very Dark Purple background
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#1E0B2F', // Very Dark Purple background
              code: {
                backgroundColor: 'transparent',
              },
            },
          },
        },
      },
    }
  },
  plugins: [require("tailwindcss-animate"), require('@tailwindcss/typography')],
} satisfies Config;
