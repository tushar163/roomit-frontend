/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/react/dist/**/*.{js,mjs}",
  ],
  theme: {
    extend: {
      boxShadow: {
        premium: "0 24px 80px rgba(0, 0, 0, 0.28)",
      },
    },
  },
};

export default config;
