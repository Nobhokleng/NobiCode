import { AIService, ModelConfiguration, Language, Theme } from '../types/services';
import { GEMINI_MODELS, OPENROUTER_MODELS } from '../constants';
import { DEFAULT_LANGUAGE } from '../constants/languages';
import { DEFAULT_THEME } from '../constants/themes';

const STORAGE_KEYS = {
  SELECTED_SERVICE: 'nobicode_selected_service',
  MODEL_CONFIG: 'nobicode_model_config',
  SELECTED_LANGUAGE: 'nobicode_selected_language',
  SELECTED_THEME: 'nobicode_selected_theme',
  STREAMING_ENABLED: 'nobicode_streaming_enabled'
};

export const getStoredService = (): AIService => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_SERVICE);
    return (stored as AIService) || 'gemini';
  } catch {
    return 'gemini';
  }
};

export const setStoredService = (service: AIService): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_SERVICE, service);
  } catch {
    // Ignore storage errors
  }
};

export const getStoredModelConfig = (): ModelConfiguration => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MODEL_CONFIG);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parsing errors
  }

  // Return default configuration
  return {
    gemini: GEMINI_MODELS[0].id,
    openrouter: OPENROUTER_MODELS[0].id
  };
};

export const setStoredModelConfig = (config: ModelConfiguration): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MODEL_CONFIG, JSON.stringify(config));
  } catch {
    // Ignore storage errors
  }
};

export const getStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE);
    return (stored as Language) || DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

export const setStoredLanguage = (language: Language): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, language);
  } catch {
    // Ignore storage errors
  }
};

export const getStoredTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_THEME);
    return (stored as Theme) || DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
};

export const setStoredTheme = (theme: Theme): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_THEME, theme);
  } catch {
    // Ignore storage errors
  }
};

export const getStoredStreamingEnabled = (): boolean => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.STREAMING_ENABLED);
    return stored === 'true';
  } catch {
    return false; // Default to false
  }
};

export const setStoredStreamingEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STREAMING_ENABLED, enabled.toString());
  } catch {
    // Ignore storage errors
  }
};
