import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import TodoList from './components/TodoList';
import { getToken, setToken, removeToken } from './utils/auth';

// Use relative URL in production (same domain), absolute URL in development
const API_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api');

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const handleLogin = (token) => {
    setToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    removeToken();
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div className="app-loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        {showRegister ? (
          <Register
            onRegister={handleLogin}
            onSwitchToLogin={() => setShowRegister(false)}
            apiUrl={API_URL}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
            apiUrl={API_URL}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <TodoList onLogout={handleLogout} apiUrl={API_URL} />
    </div>
  );
}

export default App;

