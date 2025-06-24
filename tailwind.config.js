/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // blue-600
        secondary: '#1e40af', // blue-800
        accent: '#10b981', // emerald-500
      },
    },
  },
  plugins: [],
}
