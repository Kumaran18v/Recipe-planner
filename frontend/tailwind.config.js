/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    dark: '#0F172A',
                    card: '#1E293B',
                    surface: '#111827',
                },
                primary: {
                    DEFAULT: '#F59E0B',
                    hover: '#D97706',
                },
                secondary: '#22C55E',
                text: {
                    light: '#F9FAFB',
                    gray: '#94A3B8',
                }
            },
            fontFamily: {
                heading: ['"Playfair Display"', 'serif'],
                body: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
