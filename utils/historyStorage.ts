import { CodeReviewHistoryItem, AIService, Language } from '../types/services';

const HISTORY_STORAGE_KEY = 'nobicode_review_history';
const MAX_HISTORY_ITEMS = 50; // Limit to prevent localStorage from getting too large
const WARNING_THRESHOLD = 45; // Show warning when approaching limit

export const generateHistoryId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
};

export const createCodePreview = (code: string): string => {
  const preview = code.trim().substring(0, 100);
  return preview.length < code.trim().length ? `${preview}...` : preview;
};

export const saveReviewToHistory = (
  code: string,
  response: string,
  service: AIService,
  model: string,
  language: Language
): { saved: boolean; shouldShowWarning: boolean; itemsCount: number } => {
  try {
    const historyItem: CodeReviewHistoryItem = {
      id: generateHistoryId(),
      timestamp: Date.now(),
      code: code.trim(),
      response,
      service,
      model,
      language,
      codePreview: createCodePreview(code)
    };

    const existingHistory = getReviewHistory();
    const updatedHistory = [historyItem, ...existingHistory];

    // Keep only the most recent items
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));

    return {
      saved: true,
      shouldShowWarning: trimmedHistory.length >= WARNING_THRESHOLD,
      itemsCount: trimmedHistory.length
    };
  } catch (error) {
    console.error('Failed to save review to history:', error);
    return {
      saved: false,
      shouldShowWarning: false,
      itemsCount: 0
    };
  }
};

export const getReviewHistory = (): CodeReviewHistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate that it's an array
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load review history:', error);
  }
  return [];
};

export const deleteHistoryItem = (id: string): void => {
  try {
    const history = getReviewHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete history item:', error);
  }
};

export const clearAllHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

export const getHistoryItemById = (id: string): CodeReviewHistoryItem | null => {
  const history = getReviewHistory();
  return history.find(item => item.id === id) || null;
};

export const formatHistoryTimestamp = (timestamp: number, language: Language = 'en'): string => {
  const date = new Date(timestamp);

  // Format options based on language
  const formatOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  // Language-specific locale mapping
  const localeMap: Record<Language, string> = {
    en: 'en-US',
    km: 'km-KH',
    es: 'es-ES',
    fr: 'fr-FR',
    zh: 'zh-CN',
    ja: 'ja-JP',
    ko: 'ko-KR',
    vi: 'vi-VN',
    th: 'th-TH'
  };

  try {
    return date.toLocaleDateString(localeMap[language], formatOptions);
  } catch {
    // Fallback to English if locale is not supported
    return date.toLocaleDateString('en-US', formatOptions);
  }
};

// Export functionality
export const exportHistoryAsJSON = (): void => {
  try {
    const history = getReviewHistory();
    const exportData = {
      exportDate: new Date().toISOString(),
      totalItems: history.length,
      application: 'NobiCode',
      version: '1.0',
      data: history
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nobicode-history-${new Date().toISOString().split('T')[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export history:', error);
    throw new Error('Failed to export history. Please try again.');
  }
};

export const getHistoryStats = (): { total: number; isNearLimit: boolean; remaining: number } => {
  const history = getReviewHistory();
  return {
    total: history.length,
    isNearLimit: history.length >= WARNING_THRESHOLD,
    remaining: Math.max(0, MAX_HISTORY_ITEMS - history.length)
  };
};
