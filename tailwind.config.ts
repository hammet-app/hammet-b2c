import typography from '@tailwindcss/typography'

export default {
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [typography],
}