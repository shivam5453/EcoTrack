import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Toast from './components/Toast';

// Pages Imports
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Calculate from './pages/Calculate';
import Results from './pages/Results';
import History from './pages/History';
import Tips from './pages/Tips';
import Learn from './pages/Learn';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-250 font-sans">
            
            {/* Dynamic Toast Hub */}
            <Toast />

            <Routes>
              {/* Public Authentication routes (No Navbar) */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Application routes (With persistent Navbar) */}
              <Route
                path="/"
                element={
                  <LayoutWrapper>
                    <Dashboard />
                  </LayoutWrapper>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <LayoutWrapper>
                    <Dashboard />
                  </LayoutWrapper>
                }
              />
              <Route
                path="/calculate"
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <Calculate />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <Results />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <History />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tips"
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <Tips />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/learn"
                element={
                  <LayoutWrapper>
                    <Learn />
                  </LayoutWrapper>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <Profile />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <LayoutWrapper>
                      <Settings />
                    </LayoutWrapper>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all Redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
};

// Layout wrapper injecting persistent header and responsive content container
const LayoutWrapper = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
    </>
  );
};

export default App;
