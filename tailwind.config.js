/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        darkestGray: "#14181D",
        darkGray: "#515457",
        lightGray: "#EAE8E8",
        gray: "#777676",
        offblack: "#141414",
        offwhite: "#FEFEFE",
        customFocus: "#629CF8",
        btn: {
          primary: {
            normal: "#141414",
            disabled: "#B2B2B2",
            hover: "#858585",
          },
          ghost: {
            hover: "#606060",
            disabled: "#F9F9F9",
          },
          blue: {
            normal: "#2961D1",
            hover: "#2154B9",
            disabled: "#A3BAE7",
          },
        },
      },
      borderRadius: {
        sm: "10px",
        md: "20px",
        lg: "35px",
        full: "9999px",
      },
      outline: {
        custom: "2px solid #3B82F6",
      },
      fontSize: {
        h1: "48px",
        h2: "24px",
        h3: "18px",
        p: "16px",
      },
      variants: {
        extend: {
          ringColor: ["focus"], // Enable ring color on focus
          ringWidth: ["focus"], // Enable ring width on focus
        },
      },
      screens: {
        smallMobile: "576px",
        mobile: "768px",
        tablet: "992px",
        laptop: "1096px",
        desktop: "1280px",
      },
    },
  },
  plugins: [],
};
