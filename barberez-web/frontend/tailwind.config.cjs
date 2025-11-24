/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Tema Barbería Retro - Morado y Azul
        primary: '#6B46C1',      // Morado principal
        secondary: '#4C51BF',    // Azul índigo
        accent: '#9F7AEA',       // Morado claro
        dark: '#2D3748',         // Gris oscuro
        light: '#EDF2F7',        // Gris claro
        gold: '#D69E2E',         // Dorado retro
        'primary-dark': '#553C9A',
        'secondary-dark': '#3C366B',
      },
      fontFamily: {
        'retro': ['Georgia', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'barber-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239F7AEA' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}

