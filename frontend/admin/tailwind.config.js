/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#10b981',
        'primary-light': '#ecfdf5',
        surface: '#ffffff',
        background: '#f8fafc',
        text: '#064e3b',
        'text-muted': '#64748b',
        border: '#e2e8f0',
        success: '#05cd99',
        warning: '#ffb547',
        danger: '#ee5d50',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
