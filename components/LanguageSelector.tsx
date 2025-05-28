import React from 'react';
import { Language } from '../types/services';
import { LANGUAGE_OPTIONS } from '../constants/languages';
import { useTheme } from '../contexts/ThemeContext';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onLanguageChange,
  disabled = false
}) => {
  const { themeColors } = useTheme();

  return (
    <div className="inline-block">
      <select
        id="languageSelector"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value as Language)}
        disabled={disabled}
        className={`px-3 py-2 ${themeColors.backgroundTertiary} ${themeColors.textSecondary} ${themeColors.border} rounded-md text-sm focus:ring-2 ${themeColors.borderFocus} transition-colors duration-150 ease-in-out`}
      >
        {LANGUAGE_OPTIONS.map((language) => (
          <option key={language.code} value={language.code}>
            {language.flag} {language.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
};
