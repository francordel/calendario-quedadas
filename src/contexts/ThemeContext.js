import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export const CustomThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  useEffect(() => {
    // Check localStorage first
    const savedMode = localStorage.getItem('calendar-theme-mode');
    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setMode(savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(prefersDark ? 'dark' : 'light');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('calendar-theme-mode')) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('calendar-theme-mode', newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#007AFF',
      },
      background: {
        default: mode === 'light' ? '#FAFAFA' : '#121212',
        paper: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
      },
      text: {
        primary: mode === 'light' ? '#1C1C1E' : '#FFFFFF',
        secondary: mode === 'light' ? '#8E8E93' : '#BEBEBE',
      },
      divider: mode === 'light' ? '#E5E5EA' : '#333333',
    },
    typography: {
      fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: mode === 'light' ? '#FAFAFA' : '#121212',
            fontFamily: "'Inter Tight', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
            transition: 'background-color 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            transition: 'background-color 0.3s ease',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 30, 30, 0.95)',
            color: mode === 'light' ? '#1C1C1E' : '#FFFFFF',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#FFFFFF' : '#1E1E1E',
            color: mode === 'light' ? '#1C1C1E' : '#FFFFFF',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  });

  const value = {
    mode,
    toggleMode,
    theme,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};