import React from 'react';
import { Language } from '../types/services';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryButtonProps {
  isHistoryOpen: boolean;
  onToggleHistory: () => void;
  historyCount: number;
  language: Language;
  disabled?: boolean;
}

export const HistoryButton: React.FC<HistoryButtonProps> = ({
  isHistoryOpen,
  onToggleHistory,
  historyCount,
  language,
  disabled = false
}) => {
  const { theme, themeColors } = useTheme();

  // Get translations based on language
  const getButtonText = () => {
    const translations = {
      en: isHistoryOpen ? 'Hide History' : 'Show History',
      km: isHistoryOpen ? 'លាក់ប្រវត្តិ' : 'បង្ហាញប្រវត្តិ',
      es: isHistoryOpen ? 'Ocultar Historial' : 'Mostrar Historial',
      fr: isHistoryOpen ? 'Masquer l\'Historique' : 'Afficher l\'Historique',
      zh: isHistoryOpen ? '隐藏历史' : '显示历史',
      ja: isHistoryOpen ? '履歴を隠す' : '履歴を表示',
      ko: isHistoryOpen ? '기록 숨기기' : '기록 보기',
      vi: isHistoryOpen ? 'Ẩn Lịch sử' : 'Hiện Lịch sử',
      th: isHistoryOpen ? 'ซ่อนประวัติ' : 'แสดงประวัติ'
    };
    return translations[language] || translations.en;
  };

  return (
    <button
      onClick={onToggleHistory}
      disabled={disabled}
      className={`
        relative inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${disabled
          ? `${themeColors.buttonSecondary} opacity-50 cursor-not-allowed`
          : isHistoryOpen
            ? `bg-purple-600 hover:bg-purple-700 text-white shadow-lg scale-105`
            : `${themeColors.buttonPrimary} text-white shadow-lg hover:shadow-xl hover:scale-105`
        }
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${theme === 'dark' ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
        transform hover:scale-105 active:scale-95
      `}
      title={getButtonText()}
    >
      {/* History Icon */}
      <svg
        className="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      {/* Button Text */}
      <span className="text-sm">
        {getButtonText()}
      </span>

      {/* History Count Badge */}
      {historyCount > 0 && (
        <span className={`
          ml-2 px-2 py-1 text-xs font-bold rounded-full
          ${isHistoryOpen
            ? 'bg-purple-800 text-purple-200'
            : 'bg-blue-600 text-white'
          }
        `}>
          {historyCount}
        </span>
      )}

      {/* Chevron Icon */}
      <svg
        className={`w-4 h-4 ml-2 transition-transform duration-200 ${
          isHistoryOpen ? 'rotate-180' : ''
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};
