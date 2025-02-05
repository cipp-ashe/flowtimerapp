import { useState, useEffect } from 'react';

export const useTheme = (initialDark = true) => {
  const [isDark, setIsDark] = useState(initialDark);

  // Initial theme setup
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Theme toggle effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return {
    isDark,
    toggleTheme: () => setIsDark(prev => !prev)
  };
};