import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 번들 분석 도구 (production 빌드시에만)
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8888,
    host: true,
    proxy: {
      // API 프록시 설정 (CORS 우회)
      '/api/openai': {
        target: 'https://status.openai.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/openai/, ''),
      },
      '/api/anthropic': {
        target: 'https://status.anthropic.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/anthropic/, ''),
      },
      '/api/cursor': {
        target: 'https://status.cursor.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/cursor/, ''),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: id => {
          // React 관련 라이브러리
          if (id.includes('react') || id.includes('react-dom')) {
            return 'vendor';
          }

          // 유틸리티 라이브러리
          if (id.includes('axios') || id.includes('zustand') || id.includes('lucide-react')) {
            return 'utils';
          }

          // 이미지 파일들을 별도 청크로
          if (
            id.includes('assets') &&
            (id.includes('.png') || id.includes('.jpg') || id.includes('.svg'))
          ) {
            return 'assets';
          }

          // 큰 라이브러리들을 별도 청크로
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // 파일명 최적화
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: assetInfo => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];

          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return 'images/[name]-[hash].[ext]';
          }
          if (/\.css$/i.test(assetInfo.name || '')) {
            return 'css/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    // 청크 크기 경고 임계값 증가
    chunkSizeWarningLimit: 1000,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'dist/', '**/*.d.ts'],
    },
  },
});
