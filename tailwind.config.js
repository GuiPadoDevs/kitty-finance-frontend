/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hk: {
          bg: '#FFF0F5',          // Lavender Blush (Fundo ultra fofo)
          card: '#FFFFFF',        // Branco puro para contraste de cards
          border: '#FFE4E8',      // Borda sutil rosinha
          'pink-soft': '#FFD1DC', // Rosa pastel
          'pink-light': '#FFE4E8',
          'pink-primary': '#FF85A2', // Rosa vibrante característico
          'pink-deep': '#FF4081',
          'pink-dark': '#DB2777', // Rosa escuro para tipografia em destaque
          'red-bow': '#FF1E40',   // Vermelho do lacinho da Hello Kitty
          'red-bow-dark': '#E00B2B',
          text: '#4A2040',        // Texto contrastante suave
          muted: '#9E778C',       // Texto secundário
          'green-pastel': '#34D399', // Entradas / Receitas
          'rose-pastel': '#FB7185',  // Saídas / Despesas
          'gold-accent': '#FBBF24',  // Destaques / Estrelinhas
        }
      },
      fontFamily: {
        sans: ['Quicksand', 'Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'hk-sm': '0 2px 8px -2px rgba(255, 133, 162, 0.15)',
        'hk-md': '0 8px 24px -4px rgba(255, 133, 162, 0.20)',
        'hk-lg': '0 16px 36px -6px rgba(255, 133, 162, 0.25)',
        'hk-glow': '0 0 20px rgba(255, 133, 162, 0.4)',
        'hk-bow': '0 8px 20px rgba(255, 30, 64, 0.35)',
      },
      animation: {
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'pulse-pink': 'pulse-pink 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'pulse-pink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'scale(0.98)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
