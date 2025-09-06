import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CompactDashboard from './components/CompactDashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-gray-50 p-4">
      <CompactDashboard className="max-w-7xl mx-auto" />
    </div>
  </React.StrictMode>,
); 