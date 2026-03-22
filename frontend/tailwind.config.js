/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        alt: {
          bg: 'var(--alt-bg)',
          surface: 'var(--alt-surface)',
          'surface-elevated': 'var(--alt-surface-elevated)',
          border: 'var(--alt-border)',
          text: 'var(--alt-text)',
          muted: 'var(--alt-muted)',
          primary: 'var(--alt-primary)',
          accent: 'var(--alt-accent)',
          success: 'var(--alt-success)',
          error: 'var(--alt-error)',
          cyan: 'var(--alt-cyan)',
        },
      },
      borderRadius: {
        alt: 'var(--alt-radius)',
      },
      fontFamily: {
        alt: ['var(--alt-font-ui)', 'system-ui', 'sans-serif'],
        mono: ['var(--alt-font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        brutal: '4px 4px 0 0 var(--alt-brutal-shadow)',
      },
    },
  },
  plugins: [],
}
