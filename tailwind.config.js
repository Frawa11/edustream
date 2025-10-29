/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#0A192F',    // Dark Navy
        surface: '#112240',       // Lighter Navy
        border: '#233554',         // Lightest Navy / Slate
        
        primary: {
          DEFAULT: '#64FFDA', // Bright Teal/Mint
        },
        
        'text-primary': '#CCD6F6',   // Light Slate
        'text-secondary': '#8892B0', // Slate

        accent: '#FFC700',         // Amber/Gold for accents
        success: '#10b981',        // Emerald
        danger: '#f43f5e',         // Rose
      }
    },
  },
  plugins: [],
}