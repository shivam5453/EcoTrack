import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuthContext } from './AuthContext';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const { user, updateSettings } = useAuthContext();
  const [theme, setTheme] = useState('light');

  // Sync theme with user settings when logged in, or local storage otherwise
  useEffect(() => {
    if (user?.settings?.theme) {
      setTheme(user.settings.theme);
    } else {
      const storedTheme = localStorage.getItem('theme') || 'light';
      setTheme(storedTheme);
    }
  }, [user]);

  // Apply theme class to document root element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = async () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    
    // Sync with backend if user is logged in
    if (user) {
      await updateSettings({ theme: nextTheme });
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);
