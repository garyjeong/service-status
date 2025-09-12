import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css';

// Lazy load Dashboard for better code splitting
const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard'));

// 로딩 컴포넌트
const AppLoading = () => (
  <div className="bg-background text-foreground min-h-dvh flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="animate-spin w-6 h-6 text-primary">⟳</div>
      <span className="text-muted-foreground">로딩 중...</span>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<AppLoading />}>
      <Dashboard />
    </Suspense>
  </React.StrictMode>,
); 