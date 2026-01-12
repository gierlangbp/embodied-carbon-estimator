/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#111418",
                "secondary": "#f0ede6",
                "soft-beige": "#f5f3ef",
                "card-white": "#ffffff",
                "text-main": "#111418",
                "text-muted": "#617589",
                "accent": "#F5C346",
                "background-light": "#EFEFE9",
                "surface-light": "#F8F8F4",
                "surface-dark": "#1a2632",
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"],
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "xl": "1rem",
                "2xl": "1.5rem",
                "3xl": "2rem",
                "full": "9999px"
            },
            boxShadow: {
                "soft": "0 2px 10px rgba(0,0,0,0.03)",
                "card": "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02)"
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
