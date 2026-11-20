export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#fff8f3',
        surface: '#faf4ee',
        'surface-low': '#fcf2e7',
        'surface-high': '#f1e7dc',
        primary: '#7a5360',
        'primary-container': '#f4c2d0',
        secondary: '#6b5779',
        'secondary-container': '#f1d6ff',
        lilac: '#cdb4db',
        outline: '#d3c2c6',
        ink: '#4a3b3f',
        'ink-strong': '#1f1b14',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '1.25rem',
        pill: '9999px',
      },
      boxShadow: {
        soft: '0 10px 28px -6px rgba(74, 59, 63, 0.07)',
        pill: '0 6px 18px -4px rgba(244, 194, 208, 0.7)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 280ms ease-out both',
        'fade-in': 'fade-in 220ms ease-out both',
      },
    },
  },
  plugins: [],
}
