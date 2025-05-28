/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // New color palette based on landing page
        'primary-bg-light': '#C6DAF7', // Light blue background
        'primary-bg-dark': '#2A3B4C',  // Dark blue-gray background
        'secondary-bg-light': '#FFFFFF', // White card/container background
        'secondary-bg-dark': '#1E1E1E', // Dark gray card/container background
        'primary-text-light': '#333366', // Dark blue-gray for headings
        'primary-text-dark': '#E0E0E0',  // Light gray for headings
        'secondary-text-light': '#555555', // Medium gray for body text
        'secondary-text-dark': '#AAAAAA', // Lighter gray for body text
        'accent-button-light': '#60A5FA', // Light blue for accent buttons
        'accent-button-dark': '#1E40AF',  // Darker blue for accent buttons
        'accent-button-text-light': '#FFFFFF', // White text for accent buttons
        'accent-button-text-dark': '#FFFFFF', // White text for accent buttons
        'nav-bg-light': '#F3F4F6', // Light gray for navigation background
        'nav-bg-dark': '#1A202C', // Dark gray for navigation background
        'nav-text-light': '#4B5563', // Dark gray for navigation text
        'nav-text-dark': '#D1D5DB', // Light gray for navigation text
      },
    },
  },
  plugins: [],
} 