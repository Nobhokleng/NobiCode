import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  language?: Language;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  language = 'en'
}) => {
  const { themeColors } = useTheme();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <div className={`max-w-2xl mx-auto p-6 ${themeColors.backgroundTertiary} rounded-lg shadow-lg border ${themeColors.border}`}>
      {/* Centered error content */}
      <div className="text-center mb-6">
        {/* Simple error icon */}
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Error title */}
        <h3 className={`text-xl font-semibold ${themeColors.textPrimary} mb-3`}>
          {t.errorOccurred || 'An error occurred'}
        </h3>

        {/* Error message */}
        <div className={`text-sm ${themeColors.textSecondary} p-4 ${themeColors.backgroundSecondary} rounded-lg border-l-4 border-red-500 text-center`}>
          <p className="whitespace-pre-wrap break-words font-mono leading-relaxed">{error}</p>
        </div>
      </div>
    </div>
  );
};
