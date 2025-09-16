/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 기존 시스템 색상
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // 새로운 프리미엄 그라디언트 시스템
        gradient: {
          primary: {
            from: "#667eea",
            to: "#764ba2"
          },
          secondary: {
            from: "#f093fb", 
            to: "#f5576c"
          },
          success: {
            from: "#4facfe",
            to: "#00f2fe"
          },
          warning: {
            from: "#43e97b",
            to: "#38f9d7"
          },
          danger: {
            from: "#fa709a",
            to: "#fee140"
          },
          glass: {
            from: "rgba(255, 255, 255, 0.1)",
            to: "rgba(255, 255, 255, 0.05)"
          }
        },
        // 글래스모피즘 컬러
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          medium: "rgba(255, 255, 255, 0.15)",
          dark: "rgba(0, 0, 0, 0.2)",
          border: "rgba(255, 255, 255, 0.2)"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // 프리미엄 폰트 시스템
        display: [
          'Clash Display',
          'Inter Variable',
          'Spoqa Han Sans Neo',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        body: [
          'Inter Variable',
          'Spoqa Han Sans Neo',
          '-apple-system',
          'BlinkMacSystemFont', 
          'sans-serif'
        ],
        code: [
          'JetBrains Mono',
          'SF Mono',
          'Monaco',
          'monospace'
        ],
        sans: [
          'Spoqa Han Sans Neo',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      fontSize: {
        // 반응형 타이포그래피 스케일
        'hero': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        'display': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.03em' }], 
        'title': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'body': ['clamp(0.875rem, 2vw, 1rem)', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'caption': ['clamp(0.75rem, 1.5vw, 0.875rem)', { lineHeight: '1.5', letterSpacing: '0em' }],
        'micro': ['clamp(0.625rem, 1vw, 0.75rem)', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      keyframes: {
        // 기존 애니메이션
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        // 프리미엄 애니메이션
        'glass-shimmer': {
          '0%': { 
            backgroundPosition: '-200% 0',
            opacity: '0.3'
          },
          '50%': {
            opacity: '0.8'
          },
          '100%': { 
            backgroundPosition: '200% 0',
            opacity: '0.3'
          }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 5px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 30px currentColor' }
        },
        'scale-in': {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)' 
          }
        },
        'slide-in-left': {
          '0%': { 
            opacity: '0',
            transform: 'translateX(-30px)' 
          },
          '100%': { 
            opacity: '1',
            transform: 'translateX(0)' 
          }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        // 기존 애니메이션
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        // 프리미엄 애니메이션
        'glass-shimmer': 'glass-shimmer 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in-left': 'slide-in-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-subtle': 'bounce-subtle 0.5s ease-in-out'
      },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '40px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
} 