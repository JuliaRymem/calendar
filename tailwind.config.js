/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    darkMode: "class", // behåller stöd men vi designar för light
    theme: {
      extend: {
        colors: {
          brand: {
            50:  "#f1f3ff",
            100: "#e5e8ff",
            200: "#cfd6ff",
            300: "#b6c2ff",
            400: "#9eaefc",
            500: "#7f90f5", // primär lavendel
            600: "#6b7eea",
            700: "#5b6fd6",
            800: "#4a5bb4",
            900: "#3e4d95",
          },
          luxe: {
            gold:  "#E6C35A",
            blush: "#F5C6D6",
            mint:  "#BFEAD7",
            sky:   "#CFE1FF",
          },
        },
        boxShadow: {
          glass: "0 10px 30px rgba(31, 41, 55, 0.08), 0 2px 8px rgba(31, 41, 55, 0.05)",
          glow:  "0 0 0 3px rgba(230,195,90,0.15)",
          soft:  "0 1px 2px rgba(0,0,0,0.06), 0 6px 20px rgba(0,0,0,0.06)",
        },
        borderRadius: {
          xl: "0.9rem",
          "2xl": "1.25rem",
          "3xl": "1.6rem",
        },
        backdropBlur: {
          xl: "18px",
        },
      },
    },
    plugins: [],
  };