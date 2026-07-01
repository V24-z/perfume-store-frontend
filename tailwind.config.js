/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      
      fontFamily: {
        // Define your custom font here
        sans: ['"Inter"', 'sans-serif'], 
        // Or for a more technical/monospaced feel:
        display: ['"Geist Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
