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
            disabled: "#FF0000",
            hover: "#858585",
          },
        },

        btnBlue: "#2961D1",
        btnBlueHover: "#2154B9",
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
