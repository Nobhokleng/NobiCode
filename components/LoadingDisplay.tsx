import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';

interface LoadingDisplayProps {
  language?: Language;
}

export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ language = 'en' }) => {
  const { themeColors } = useTheme();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <div className={`p-8 ${themeColors.backgroundTertiary} ${themeColors.textSecondary} rounded-lg shadow-inner border ${themeColors.border}`}>
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Animated spinner */}
        <div className="relative">
          <div className={`w-16 h-16 border-4 ${themeColors.border} rounded-full animate-spin`}>
            <div className={`absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin`}></div>
          </div>
          {/* Inner spinning circle */}
          <div className="absolute top-2 left-2 w-12 h-12 border-2 border-transparent border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h3 className={`text-xl font-semibold ${themeColors.textPrimary} mb-2`}>
            {t.analyzing || 'Analyzing your code...'}
          </h3>
          <p className={`text-sm ${themeColors.textMuted} max-w-md`}>
            {t.pleaseWait || 'Please wait while we review your code'}
          </p>
        </div>

        {/* Animated dots */}
        <div className="flex space-x-2">
          <div className={`w-3 h-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-3 h-3 bg-purple-500 dark:bg-purple-400 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
          <div className={`w-3 h-3 bg-pink-500 dark:bg-pink-400 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Progress bar simulation */}
        <div className="w-full max-w-sm space-y-2">
          <div className={`w-full h-2 ${themeColors.backgroundSecondary} rounded-full overflow-hidden border ${themeColors.border}`}>
            <div className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 rounded-full animate-pulse transition-all duration-1000`} style={{ width: '65%' }}></div>
          </div>
          <p className={`text-xs ${themeColors.textMuted} text-center`}>
            Processing your code...
          </p>
        </div>

        {/* Additional visual elements */}
        <div className="flex items-center space-x-4 opacity-60">
          <div className={`w-1 h-8 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse`} style={{ animationDelay: '0ms' }}></div>
          <div className={`w-1 h-6 bg-purple-500 dark:bg-purple-400 rounded-full animate-pulse`} style={{ animationDelay: '200ms' }}></div>
          <div className={`w-1 h-10 bg-pink-500 dark:bg-pink-400 rounded-full animate-pulse`} style={{ animationDelay: '400ms' }}></div>
          <div className={`w-1 h-4 bg-indigo-500 dark:bg-indigo-400 rounded-full animate-pulse`} style={{ animationDelay: '600ms' }}></div>
          <div className={`w-1 h-7 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse`} style={{ animationDelay: '800ms' }}></div>
        </div>
      </div>
    </div>
  );
};
