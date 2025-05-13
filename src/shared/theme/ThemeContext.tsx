import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createTheme } from './index';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ReturnType<typeof createTheme>;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Get initial theme from localStorage or default to 'dark'
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : 'dark';
  });

  // Create theme object based on current mode
  const theme = createTheme(mode);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', mode);
    // You might want to add some CSS variables or class to body here
    document.body.setAttribute('data-theme', mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 