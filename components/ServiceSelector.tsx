import React from 'react';
import { AIService, SERVICE_OPTIONS, Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';
import { useTheme } from '../contexts/ThemeContext';

interface ServiceSelectorProps {
  selectedService: AIService;
  onServiceChange: (service: AIService) => void;
  disabled?: boolean;
  language?: Language;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  selectedService,
  onServiceChange,
  disabled = false,
  language = 'en'
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const { themeColors } = useTheme();

  return (
    <div className="mb-6">
      <label htmlFor="serviceSelector" className={`block text-sm font-medium ${themeColors.textSecondary} mb-2`}>
        {t.selectService}
      </label>
      <select
        id="serviceSelector"
        value={selectedService}
        onChange={(e) => onServiceChange(e.target.value as AIService)}
        disabled={disabled}
        className={`w-full p-3 ${themeColors.backgroundTertiary} ${themeColors.textSecondary} ${themeColors.border} rounded-lg shadow-sm focus:ring-2 ${themeColors.borderFocus} transition-colors duration-150 ease-in-out`}
      >
        {SERVICE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label} - {option.description}
          </option>
        ))}
      </select>
    </div>
  );
};
