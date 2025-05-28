import React from 'react';
import { AIService, ModelOption, Language } from '../types/services';
import { GEMINI_MODELS, OPENROUTER_MODELS } from '../constants';
import { UI_TRANSLATIONS } from '../constants/languages';
import { useTheme } from '../contexts/ThemeContext';

interface ModelSelectorProps {
  selectedService: AIService;
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled?: boolean;
  language?: Language;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedService,
  selectedModel,
  onModelChange,
  disabled = false,
  language = 'en'
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const { themeColors } = useTheme();

  const getModelsForService = (service: AIService) => {
    return service === 'gemini' ? GEMINI_MODELS : OPENROUTER_MODELS;
  };

  const models = getModelsForService(selectedService);
  const currentModel = models.find(model => model.id === selectedModel);

  return (
    <div className="mb-4">
      <label htmlFor="modelSelector" className={`block text-sm font-medium ${themeColors.textSecondary} mb-2`}>
        {t.selectModel} {selectedService === 'gemini' ? 'Gemini' : 'OpenRouter'}
      </label>
      <select
        id="modelSelector"
        value={selectedModel}
        onChange={(e) => onModelChange(e.target.value)}
        disabled={disabled}
        className={`w-full p-3 ${themeColors.backgroundTertiary} ${themeColors.textSecondary} ${themeColors.border} rounded-lg shadow-sm focus:ring-2 ${themeColors.borderFocus} transition-colors duration-150 ease-in-out`}
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name} - {model.description[language]}
          </option>
        ))}
      </select>
      {currentModel && (
        <p className={`mt-1 text-xs ${themeColors.textMuted}`}>
          {currentModel.description[language]}
        </p>
      )}
    </div>
  );
};
