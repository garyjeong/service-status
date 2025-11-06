import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Language } from '../types/ui';

interface LoadingProgressBarProps {
  loaded: number;
  total: number;
  loading: number;
  language: Language;
  theme: 'light' | 'dark';
  onRetry?: () => void;
  error?: string | null;
}

const LoadingProgressBar: React.FC<LoadingProgressBarProps> = ({
  loaded,
  total,
  loading,
  language,
  theme,
  onRetry,
  error
}) => {
  const t = {
    ko: {
      loading: '로딩 중',
      loaded: '완료',
      loadingServices: '로딩 중인 서비스',
      retry: '재시도',
      error: '오류 발생'
    },
    en: {
      loading: 'Loading',
      loaded: 'Loaded',
      loadingServices: 'Loading Services',
      retry: 'Retry',
      error: 'Error'
    }
  }[language];

  const percentage = total > 0 ? Math.round((loaded / total) * 100) : 0;
  const isLoading = loading > 0;

  return (
    <motion.div
      className="loading-progress-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="loading-progress-container">
        {/* 진행률 헤더 */}
        <div className="loading-progress-header">
          <div className="flex items-center gap-2">
            {isLoading ? (
              <RefreshCw className="w-4 h-4 text-primary animate-spin" />
            ) : error ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            )}
            <span className="loading-progress-title">
              {isLoading ? t.loading : error ? t.error : t.loaded}
            </span>
          </div>
          <div className="loading-progress-count">
            {loaded}/{total}
          </div>
        </div>

        {/* 진행률 바 */}
        <div className="loading-progress-track">
          <motion.div
            className={`loading-progress-fill ${error ? 'error' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>

        {/* 진행률 퍼센트 */}
        <div className="loading-progress-percentage">
          {percentage}%
        </div>

        {/* 에러 메시지 및 재시도 버튼 */}
        {error && onRetry && (
          <motion.div
            className="loading-progress-error"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="loading-progress-error-message">{error}</p>
            <button
              onClick={onRetry}
              className="loading-progress-retry-btn"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t.retry}</span>
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default LoadingProgressBar;

