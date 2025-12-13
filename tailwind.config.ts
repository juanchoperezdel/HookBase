import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        zylo: {
          black: '#111827',
          gray: '#6B7280',
          green: '#6EE7B7', // Vibrant pastel green
          greenLight: '#D1FAE5',
          purple: '#E879F9', // Vibrant pastel purple
          purpleLight: '#FAE8FF',
          yellow: '#FCD34D', // Vibrant pastel yellow
          yellowLight: '#FEF9C3',
          pink: '#F9A8D4',
          bg: '#FFFFFF',
        }
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 40px -10px rgba(0, 0, 0, 0.08)',
      }
    }
  },
  plugins: [],
} satisfies Config;
