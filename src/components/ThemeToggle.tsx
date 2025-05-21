
import React from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

export function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  
  // Initialize theme on component mount
  React.useEffect(() => {
    // Force dark mode
    document.documentElement.classList.add('dark');
  }, []);

  return null; // No toggle button to render
}
