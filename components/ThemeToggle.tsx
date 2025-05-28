import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';

interface ThemeToggleProps {
  language?: Language;
  disabled?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  language = 'en', 
  disabled = false 
}) => {
  const { theme, toggleTheme, themeColors } = useTheme();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <button
      onClick={toggleTheme}
      disabled={disabled}
      className={`
        relative inline-flex items-center px-3 py-2 rounded-lg font-medium transition-all duration-200
        ${disabled
          ? `${themeColors.buttonSecondary} opacity-50 cursor-not-allowed`
          : `${themeColors.buttonSecondary} ${themeColors.buttonSecondaryHover} shadow-md hover:shadow-lg hover:scale-105`
        }
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
        transform active:scale-95
      `}
      title={theme === 'light' ? t.switchToDark : t.switchToLight}
    >
      {/* Theme Icon */}
      {theme === 'light' ? (
        // Moon icon for switching to dark
        <svg
          className={`w-5 h-5 ${themeColors.textPrimary}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      ) : (
        // Sun icon for switching to light
        <svg
          className={`w-5 h-5 ${themeColors.textPrimary}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      )}
      
      {/* Optional text label */}
      <span className={`ml-2 text-sm ${themeColors.textPrimary} hidden sm:inline`}>
        {theme === 'light' ? t.darkMode : t.lightMode}
      </span>
    </button>
  );
};
