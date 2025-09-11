/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 기본 시스템 색상 (RGB 값 직접 사용)
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        
        // 메인 컬러 시스템
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },

        // 상태 색상 시스템 (CSS 변수 통합)
        status: {
          operational: "rgb(var(--status-operational))",
          degraded: "rgb(var(--status-degraded))",
          partial: "rgb(var(--status-partial-outage))",
          outage: "rgb(var(--status-major-outage))",
          maintenance: "rgb(var(--status-maintenance))",
          unknown: "rgb(var(--status-unknown))",
        },

        // 브랜드 색상 시스템
        brand: {
          mint: {
            primary: "#2EFFB4",
            light: "#D1F7E3",
          },
          green: {
            success: "#00A86B",
          },
          black: {
            primary: "#030303",
          },
          gray: {
            secondary: "#EDECE8",
          },
        },

        // 배경 색상 시스템
        bg: {
          primary: "#0A0A0A",
          secondary: "#141414", 
          tertiary: "#1A1A1A",
          accent: "#1F1F1F",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // 사용자 정의 스페이싱
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // 사용자 정의 스크린 크기 (반응형 훅과 동일)
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // 최대 너비 미디어 쿼리
        'max-sm': {'max': '639px'},
        'max-md': {'max': '767px'},
        'max-lg': {'max': '1023px'},
      },
      
      // 그림자 시스템
      boxShadow: {
        'service-card': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'service-card-hover': '0 4px 16px rgba(0, 0, 0, 0.25)',
        'service-card-expanded': '0 8px 32px rgba(0, 0, 0, 0.2)',
        'favorite-glow': '0 4px 16px rgba(46, 255, 180, 0.1)',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
      },
      keyframes: {
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
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
} 