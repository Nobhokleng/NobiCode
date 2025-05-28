
import React from 'react';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';
import { useTheme } from '../contexts/ThemeContext';

interface CodeInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  disabled?: boolean;
  rows?: number;
  language?: Language;
}

export const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
  disabled = false,
  rows = 15,
  language = 'en'
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const { themeColors } = useTheme();

  return (
    <div>
      <label htmlFor="codeInput" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1`}>
        {t.codeInput}
      </label>
      <textarea
        id="codeInput"
        value={value}
        onChange={onChange}
        placeholder={t.codeInputPlaceholder}
        disabled={disabled}
        rows={rows}
        className={`w-full p-4 font-mono text-sm ${themeColors.backgroundTertiary} ${themeColors.textSecondary} ${themeColors.border} rounded-lg shadow-sm focus:ring-2 ${themeColors.borderFocus} transition-colors duration-150 ease-in-out`}
        spellCheck="false"
      />
    </div>
  );
};