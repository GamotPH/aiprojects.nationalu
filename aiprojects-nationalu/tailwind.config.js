/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'nu-blue': '#0b3b8f',
        'nu-blue-600': '#0d46a0',
        'nu-blue-700': '#0a3680',
        'ink': '#0f172a',
        'ink-soft': '#334155',
      },
      borderRadius: {
        'card': '18px'
      },
      boxShadow: {
        'card': '0 10px 25px rgba(16, 24, 40, 0.08)'
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
