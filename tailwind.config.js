import { nextui } from "@nextui-org/theme";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f1fe",
          100: "#cce3fd",
          200: "#99c7fb",
          300: "#d4d4d8",
          400: "#338ef7",
          500: "#006FEE",
          600: "#005bc4",
          700: "#004493",
          800: "#002e62",
        },
        secondary: {
          50: "#f2eafa",
          100: "#e4d4f4",
          200: "#c9a9e9",
          300: "#ae7ede",
          400: "#9353d3",
          500: "#7828c8",
          600: "#6020a0",
          700: "#481878",
          800: "#301050",
        },
        success: {
          50: "#e8faf0",
          100: "#d1f4e0",
          200: "#a2e9c1",
          300: "#74dfa2",
          400: "#45d483",
          500: "#17c964",
          600: "#12a150",
          700: "#0e793c",
          800: "#095028",
        },
        warning: {
          50: "#fefce8",
          100: "#fdedd3",
          200: "#fbdba7",
          300: "#f9c97c",
          400: "#f7b750",
          500: "#f5a524",
          600: "#c4841d",
          700: "#936316",
          800: "#62420e",
        },
        error: {
          50: "#fee7ef",
          100: "#fdd0df",
          200: "#faa0bf",
          300: "#f871a0",
          400: "#f54180",
          500: "#f31260",
          600: "#c20e4d",
          700: "#920b3a",
          800: "#610726",
        },
        foreground: {
          light: "#11181C",
          dark: "#ECEDEE",
        },
        background: {
          light: "#FFFFFF",
          dark: "#000000",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
