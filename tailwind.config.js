/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        offBlack: "#1F2937", // For text
        offWhite: "#F9FAFB", // For background
        customFocus: "#3B82F6",
      },
      borderColor: {
        DEFAULT: "#1F2937",
      },
      outline: {
        custom: "2px solid #3B82F6",
      },
      variants: {
        extend: {
          ringColor: ["focus"], // Enable ring color on focus
          ringWidth: ["focus"], // Enable ring width on focus
        },
      },
    },
  },
  plugins: [],
};
