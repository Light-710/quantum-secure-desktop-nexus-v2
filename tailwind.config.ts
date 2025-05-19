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
        border: "#D6D2C9",       // Muted Beige-Gray
        input: "#D6D2C9",        // Muted Beige-Gray
        ring: "#C47D5F",         // Terracotta
        background: "#F7F5F2",   // Warm Off-White
        foreground: "#5F5D58",   // Soft Gray-Brown
        primary: {
          DEFAULT: "#C47D5F",    // Muted Terracotta
          foreground: "#FFFFFF", // White for text on primary
        },
        secondary: {
          DEFAULT: "#8A9B6E",    // Sage Green
          foreground: "#FFFFFF", // White for text on secondary
        },
        destructive: {
          DEFAULT: "#A84332",    // Brick Red
          foreground: "#FFFFFF", // White for text on destructive
        },
        muted: {
          DEFAULT: "#F7F5F2",    // Warm Off-White (same as background)
          foreground: "#A8A39D", // Muted Beige
        },
        accent: {
          DEFAULT: "#8A9B6E",    // Sage Green (same as secondary)
          foreground: "#FFFFFF", // White for text on accent
        },
        popover: {
          DEFAULT: "#FCFAF7",    // Cream
          foreground: "#3E3D3A", // Warm Charcoal
        },
        card: {
          DEFAULT: "#FCFAF7",    // Cream
          foreground: "#3E3D3A", // Warm Charcoal
        },
        // Keep previous color groups but update with new palette
        modern: {
          50: "#F7F5F2",        // Warm Off-White
          100: "#FCFAF7",       // Cream
          200: "#D6D2C9",       // Muted Beige-Gray
          300: "#A8A39D",       // Muted Beige
          400: "#5F5D58",       // Soft Gray-Brown
          500: "#3E3D3A",       // Warm Charcoal
          blue: "#C47D5F",      // Terracotta (replacing blue)
          teal: "#8A9B6E",      // Sage Green (replacing teal)
          green: "#6B8E23",     // Olive Green
          red: "#A84332",       // Brick Red
          purple: "#9B8579",    // Warm Brown (replacing purple)
        },
        // Update existing colors to match new theme
        luxury: {
          50: "#FCFAF7",        // Cream
          100: "#F7F5F2",       // Warm Off-White
          200: "#D6D2C9",       // Muted Beige-Gray
          300: "#A8A39D",       // Muted Beige
          400: "#5F5D58",       // Soft Gray-Brown
          500: "#3E3D3A",       // Warm Charcoal
          accent: "#E5A17D",    // Peach
        },
        warm: {
          50: "#FCFAF7",        // Cream
          100: "#E5A17D",       // Peach
          200: "#C47D5F",       // Terracotta
          300: "#A84332",       // Brick Red
        },
        cyber: {
          "dark": "#3E3D3A",       // Warm Charcoal
          "dark-blue": "#5F5D58",  // Soft Gray-Brown
          "blue": "#C47D5F",       // Terracotta
          "teal": "#8A9B6E",       // Sage Green
          "green": "#6B8E23",      // Olive Green
          "red": "#A84332",        // Brick Red
          "purple": "#9B8579",     // Warm Brown
          "gray": "#A8A39D",       // Muted Beige
          "black": "#3E3D3A",      // Warm Charcoal
          "light": "#F7F5F2",      // Warm Off-White
        },
      },
      backgroundImage: {
        'warm-gradient': 'linear-gradient(135deg, #FCFAF7 0%, #E5A17D 100%)',
        'cyber-gradient': 'linear-gradient(to right, #F7F5F2, #FCFAF7)',
        'blue-gradient': 'linear-gradient(135deg, #FCFAF7 0%, #E5A17D 100%)',
        'green-gradient': 'linear-gradient(135deg, #F7F5F2 0%, #8A9B6E 50%)',
        'light-gradient': 'linear-gradient(to right, #F7F5F2, #FCFAF7)',
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(214, 210, 201, 0.1), 0 2px 4px -1px rgba(214, 210, 201, 0.06)',
        'elegant': '0 10px 15px -3px rgba(214, 210, 201, 0.1), 0 4px 6px -2px rgba(214, 210, 201, 0.05)',
        'warm-subtle': '0 4px 6px -1px rgba(196, 125, 95, 0.05), 0 2px 4px -1px rgba(196, 125, 95, 0.03)',
        'blue-glow': '0 0 10px rgba(196, 125, 95, 0.5), 0 0 20px rgba(196, 125, 95, 0.2)',
        'green-glow': '0 0 10px rgba(138, 155, 110, 0.5), 0 0 20px rgba(138, 155, 110, 0.2)',
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
            color: '#5F5D58', // Match foreground color
            a: {
              color: '#C47D5F', // Terracotta (primary)
              '&:hover': {
                color: '#A84332', // Brick Red
              },
            },
            h1: {
              color: '#3E3D3A', // Warm Charcoal
            },
            h2: {
              color: '#3E3D3A', // Warm Charcoal
            },
            h3: {
              color: '#3E3D3A', // Warm Charcoal
            },
            h4: {
              color: '#3E3D3A', // Warm Charcoal
            },
            code: {
              color: '#A84332', // Brick Red
              backgroundColor: '#F7F5F2', // Warm Off-White
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            pre: {
              backgroundColor: '#F7F5F2', // Warm Off-White
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
