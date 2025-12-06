import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CompactDashboard from './components/CompactDashboard';
import { ThemeProvider } from './design-system/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <CompactDashboard />
    </ThemeProvider>
  </React.StrictMode>,
); 