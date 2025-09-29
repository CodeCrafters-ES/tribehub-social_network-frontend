import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Hero from '../../components/landing/Hero';
import LoginForm from '../../components/landing/LoginForm';
import Dashboard from '../Dashboard';
import ProtectedRoute from '../../components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Ruta principal - Landing page */}
        <Route
          path="/"
          element={
            <div className="landing-page">
              <Hero />
            </div>
          }
        />

        {/* Ruta del dashboard - Protegida */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta por defecto - redirigir a landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
