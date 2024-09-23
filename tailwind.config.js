/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offBlack: "#1F2937", // For text
        offWhite: "#F9FAFB", // For background
      },
      borderColor: {
        DEFAULT: "#1F2937",
      },
    },
  },
  plugins: [],
};
