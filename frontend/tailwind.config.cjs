/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          600: '#0d9488',
          900: '#134e4a',
        },
        emerald: {
          50: '#f0fdf4',
          600: '#16a34a',
          900: '#166534',
        }
      }
    },
  },
  plugins: [],
}
