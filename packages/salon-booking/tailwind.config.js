// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure this matches your project structure
  ],
  theme: {
    extend: {
      animation: {
        'fade-forward': 'fadeForward .8s ease-out forwards',
      },
      keyframes: {
        fadeForward: {
          '0%': {
            opacity: 0,
            transform: 'scale(0.95)',
            filter: 'blur(1px)',
          },
          '100%': {
            opacity: 1,
            transform: 'scale(1)',
            filter: 'blur(0)',
          },
        },
      },
    },
  },
  plugins: [],
};
