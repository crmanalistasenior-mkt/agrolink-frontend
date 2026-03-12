import React from 'react';
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import { ToastContainer } from './components/ToastContainer';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToastProvider>
      <AppDataProvider>
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </AppDataProvider>
    </ToastProvider>
  </React.StrictMode>
);
