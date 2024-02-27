import type { Config } from 'tailwindcss'
import { nextui } from "@nextui-org/react";
import pApectRation from "@tailwindcss/aspect-ratio"

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      '2xl': { 'max': '1535px' },
      'xl': { 'max': '1279px' },
      'lg': { 'max': '1023px' },
      'md': { 'max': '767px' },
      'sm': { 'max': '639px' },
    },
    extend: {
      width: {
        'clamp-ch': 'clamp(45ch, 50%, 75ch)'
      },
      borderRadius: {
        'inherit': 'inherit'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      gridTemplateColumns: {
        'sm-card': 'repeat(auto-fill,minmax(130px,1fr))',
        'md-card': 'repeat(auto-fill,minmax(170px,1fr))',
        'bg-card': 'repeat(auto-fill,minmax(210px,1fr))',
      },
      gridTemplateRows: {
        'sm-card': 'repeat(auto-fill,minmax(130px,1fr))',
        'md-card': 'repeat(auto-fill,minmax(170px,1fr))',
        'bg-card': 'repeat(auto-fill,minmax(210px,1fr))',
      },
      boxShadow: {
        'perfect-md': 'rgb(0 0 0 / 35%) 0px 0px 20px 0px',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s',
        'fade-out': 'fadeOut 0.25s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      }
    },
  },

  darkMode: "class",
  plugins: [pApectRation, nextui({
    addCommonColors: true,
    themes: {
      dark: {
        colors: {
          background: "#151515", //18 
          accented: "#2f2f2f", // Custom-named color for dark theme
          pure: {opposite: "#fff", theme: '#000'}, //opposite of theme, i.e for dark is pure white and vicevirsa
        }
      },
      light: {
        colors: {
          foreground: '#151515',
          accented: "#e0e0e0", // Custom-named color for dark theme
          pure: {opposite: "#000", theme: '#fff'}, //opposite of theme, i.e for light is pure black and vicevirsa
        }
      },
    }
  })],
}
export default config
