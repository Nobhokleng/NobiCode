import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';

interface StreamingToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  disabled?: boolean;
  language?: Language;
}

export const StreamingToggle: React.FC<StreamingToggleProps> = ({
  enabled,
  onToggle,
  disabled = false,
  language = 'en'
}) => {
  const { themeColors } = useTheme();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="streamingToggle" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1`}>
            {t.streamingMode || 'Streaming Mode'}
          </label>
          <p className={`text-xs ${themeColors.textMuted}`}>
            {t.streamingDescription || 'Enable real-time response streaming for faster feedback'}
          </p>
        </div>
        
        <button
          id="streamingToggle"
          type="button"
          onClick={() => onToggle(!enabled)}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }
            ${enabled 
              ? 'bg-gradient-to-r from-blue-600 to-purple-700' 
              : `${themeColors.backgroundTertiary} ${themeColors.border} border`
            }
          `}
          role="switch"
          aria-checked={enabled}
          aria-labelledby="streamingToggle"
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-200 ease-in-out
              ${enabled ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
      
      {/* Streaming indicator */}
      {enabled && (
        <div className="mt-2 flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className={`text-xs ${themeColors.textMuted}`}>
            {t.streamingEnabled || 'Streaming enabled'}
          </span>
        </div>
      )}
    </div>
  );
};
