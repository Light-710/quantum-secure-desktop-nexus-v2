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
        border: "#3A3A3C",       // Dark border
        input: "#3A3A3C",        // Dark input border
        ring: "#7B68EE",         // Bright purple for focus rings
        background: "#1A1A1A",   // Dark background
        foreground: "#E0E0E0",   // Light text for dark background
        primary: {
          DEFAULT: "#7B68EE",    // Bright purple for primary actions
          foreground: "#FFFFFF", // White text on primary
        },
        secondary: {
          DEFAULT: "#4A4A4C",    // Subtle dark gray for secondary elements
          foreground: "#E0E0E0", // Light text on secondary
        },
        destructive: {
          DEFAULT: "#FF5A5A",    // Bright red for destructive actions
          foreground: "#FFFFFF", // White text on destructive
        },
        muted: {
          DEFAULT: "#2A2A2A",    // Slightly lighter than background
          foreground: "#A0A0A0", // Muted text color
        },
        accent: {
          DEFAULT: "#5D5FEF",    // Accent color
          foreground: "#FFFFFF", // White text on accent
        },
        popover: {
          DEFAULT: "#252525",    // Popover background
          foreground: "#E0E0E0", // Light text on popover
        },
        card: {
          DEFAULT: "#252525",    // Card background
          foreground: "#E0E0E0", // Light text on card
        },
        // Keep previous color groups but update with new dark palette
        modern: {
          50: "#2A2A2A",        // Darkest shade
          100: "#252525",       // Dark shade
          200: "#3A3A3C",       // Border color
          300: "#A0A0A0",       // Muted text
          400: "#E0E0E0",       // Light text
          500: "#FFFFFF",       // White
          blue: "#7B68EE",      // Primary purple
          teal: "#5D5FEF",      // Accent color
          green: "#50C878",     // Success green
          red: "#FF5A5A",       // Error red
          purple: "#9580FF",    // Light purple
        },
        // Update existing colors to match new theme
        luxury: {
          50: "#252525",        // Dark shade
          100: "#2A2A2A",       // Slightly lighter dark
          200: "#3A3A3C",       // Border color
          300: "#A0A0A0",       // Muted text
          400: "#E0E0E0",       // Light text
          500: "#FFFFFF",       // White
          accent: "#9580FF",    // Light purple accent
        },
        warm: {
          50: "#252525",        // Dark shade
          100: "#9580FF",       // Light purple
          200: "#7B68EE",       // Primary purple
          300: "#FF5A5A",       // Error red
        },
        cyber: {
          "dark": "#1A1A1A",       // Darkest background
          "dark-blue": "#252525",  // Dark shade
          "blue": "#7B68EE",       // Primary purple
          "teal": "#5D5FEF",       // Accent color
          "green": "#50C878",      // Success green
          "red": "#FF5A5A",        // Error red
          "purple": "#9580FF",     // Light purple
          "gray": "#A0A0A0",       // Muted text
          "black": "#000000",      // True black
          "light": "#E0E0E0",      // Light text
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #252525 0%, #7B68EE 100%)',
        'cyber-gradient': 'linear-gradient(to right, #1A1A1A, #252525)',
        'blue-gradient': 'linear-gradient(135deg, #252525 0%, #7B68EE 100%)',
        'green-gradient': 'linear-gradient(135deg, #1A1A1A 0%, #5D5FEF 50%)',
        'light-gradient': 'linear-gradient(to right, #2A2A2A, #3A3A3C)',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'elegant': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        'warm-subtle': '0 4px 6px -1px rgba(123, 104, 238, 0.2), 0 2px 4px -1px rgba(123, 104, 238, 0.1)',
        'blue-glow': '0 0 10px rgba(123, 104, 238, 0.5), 0 0 20px rgba(123, 104, 238, 0.2)',
        'green-glow': '0 0 10px rgba(93, 95, 239, 0.5), 0 0 20px rgba(93, 95, 239, 0.2)',
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
            color: '#E0E0E0', // Match foreground color
            a: {
              color: '#7B68EE', // Terracotta (primary)
              '&:hover': {
                color: '#FF5A5A', // Brick Red
              },
            },
            h1: {
              color: '#FFFFFF', // White for dark background
            },
            h2: {
              color: '#FFFFFF', // White for dark background
            },
            h3: {
              color: '#FFFFFF', // White for dark background
            },
            h4: {
              color: '#FFFFFF', // White for dark background
            },
            code: {
              color: '#FF5A5A', // Brick Red
              backgroundColor: '#1A1A1A', // Dark background
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#1A1A1A', // Dark background
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
