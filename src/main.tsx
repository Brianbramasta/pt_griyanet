import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/globals.css';
import AppRoutes from './routes';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);