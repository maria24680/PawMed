/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pawmed: {
          light: '#ADD8E6',
          DEFAULT: '#4A90D9',
          dark: '#2C5F8A',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        pawmed: {
          "primary": "#4A90D9",
          "secondary": "#ADD8E6",
          "accent": "#2C5F8A",
          "neutral": "#1A1A2E",
          "base-100": "#F8FAFC",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
      "light",
      "dark",
    ],
  },
};