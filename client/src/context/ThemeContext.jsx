import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Mode can be 'dark', 'light', or 'system'
  const [mode, setMode] = useState(localStorage.getItem('app_theme_mode') || 'dark');
  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('app_theme_mode', mode);

    const applyTheme = (theme) => {
      if (theme === 'light') {
        root.classList.add('light-mode');
        setResolvedTheme('light');
      } else {
        root.classList.remove('light-mode');
        setResolvedTheme('dark');
      }
    };

    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      applyTheme(systemTheme);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => applyTheme(e.matches ? 'dark' : 'light');
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      applyTheme(mode);
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
