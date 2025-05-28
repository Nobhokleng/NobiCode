export type AIService = 'gemini' | 'openrouter';
export type Language = 'en' | 'km' | 'es' | 'fr' | 'zh' | 'ja' | 'ko' | 'vi' | 'th';
export type Theme = 'light' | 'dark';

// Streaming-related types
export type StreamingCallback = (chunk: string) => void;
export type StreamingCompleteCallback = (fullResponse: string) => void;
export type StreamingErrorCallback = (error: Error) => void;

export interface StreamingOptions {
  enabled: boolean;
  onChunk?: StreamingCallback;
  onComplete?: StreamingCompleteCallback;
  onError?: StreamingErrorCallback;
}

export interface ThemeColors {
  // Background colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Border colors
  border: string;
  borderFocus: string;

  // Button colors
  buttonPrimary: string;
  buttonPrimaryHover: string;
  buttonSecondary: string;
  buttonSecondaryHover: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Accent colors
  accent: string;
  accentHover: string;
}

// History-related types
export interface CodeReviewHistoryItem {
  id: string;
  timestamp: number;
  code: string;
  response: string;
  service: AIService;
  model: string;
  language: Language;
  codePreview: string; // First 100 characters of code for display
}

export interface ModelOption {
  id: string;
  name: string;
  description: {
    [key in Language]: string;
  };
  maxTokens: number;
  inputCost: number;
  outputCost: number;
}

export interface ServiceOption {
  value: AIService;
  label: string;
  description: string;
}

export interface ModelConfiguration {
  gemini: string;
  openrouter: string;
}

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    value: 'gemini',
    label: 'Gemini AI',
    description: 'Google Gemini AI for code review'
  },
  {
    value: 'openrouter',
    label: 'OpenRouter',
    description: 'OpenRouter AI for code review'
  }
];
