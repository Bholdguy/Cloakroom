import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Page base
        bg: '#F8F9FA',
        // Neo-Brutalist palette
        violet: '#7B5FF0',
        'violet-dark': '#5B3FD0',
        'violet-light': '#EDE9FE',
        // Card fills
        'lavender-card': '#C4B5FD',
        'peach-card': '#FDBA74',
        'mint-card': '#86EFAC',
        'yellow-card': '#FEF08A',
        'pink-card': '#FBCFE8',
        // Dark footer
        'footer-dark': '#0B0F19',
        // Legacy (keep for any remaining references)
        cream: '#F4F1EA',
        obsidian: '#0F1115',
        neon: '#00FF66',
        lilac: '#F8F7FC',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        // legacy
        serif: ['var(--font-space-grotesk)', 'Georgia', 'serif'],
      },
      boxShadow: {
        brutal: '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
      },
    },
  },
  plugins: [],
};

export default config;
