
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
      padding: '2rem',
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px',
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // Custom colors for futuristic theme
        cyber: {
          blue: '#5CEFFF',
          purple: '#3A0CA3',
          green: '#4DFFA7',
          red: '#FF4D6D',
          dark: '#0B0C10',
          'dark-blue': '#1F2833',
          gray: '#C5C6C7',
          teal: '#66FCF1',
          'dark-teal': '#45A29E'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        "accordion-down": {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        "accordion-up": {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        "pulse-slow": {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        "glow": {
          '0%, 100%': { boxShadow: '0 0 5px rgb(92, 239, 255, 0.5), 0 0 10px rgb(92, 239, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgb(92, 239, 255, 0.8), 0 0 30px rgb(92, 239, 255, 0.5)' },
        },
        "float": {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        "scan-line": {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        "flicker": {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.4' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 4s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scan-line 8s linear infinite",
        "flicker": "flicker 8s linear infinite",
      },
      backgroundImage: {
        'cyber-grid': "linear-gradient(90deg, rgba(92, 239, 255, 0.1) 1px, transparent 1px), linear-gradient(rgba(92, 239, 255, 0.1) 1px, transparent 1px)",
        'cyber-gradient': "linear-gradient(to right, rgba(11, 12, 16, 0.8), rgba(31, 40, 51, 0.8))",
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

