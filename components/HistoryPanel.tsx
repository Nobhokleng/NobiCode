import React, { useState } from 'react';
import { CodeReviewHistoryItem, Language } from '../types/services';
import { HistoryItem } from './HistoryItem';
import { clearAllHistory, deleteHistoryItem, exportHistoryAsJSON } from '../utils/historyStorage';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryPanelProps {
  isOpen: boolean;
  history: CodeReviewHistoryItem[];
  onHistoryChange: () => void;
  onViewItem: (item: CodeReviewHistoryItem) => void;
  onClose: () => void;
  onClearCurrentSession?: () => void;
  language: Language;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  isOpen,
  history,
  onHistoryChange,
  onViewItem,
  onClose,
  onClearCurrentSession,
  language
}) => {
  const { themeColors } = useTheme();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [clearOption, setClearOption] = useState<'history-only' | 'everything'>('history-only');

  const getTranslations = () => {
    const translations = {
      en: {
        reviewHistory: 'Review History',
        noHistory: 'No review history yet',
        noHistoryDescription: 'Your code review history will appear here after you analyze some code.',
        clearHistory: 'Clear All History',
        confirmClearHistory: 'This will permanently delete all {count} saved code reviews.',
        clearDialogTitle: 'Clear All Review History?',
        clearCurrentSessionQuestion: 'What about your current session?',
        keepCurrentSession: 'Keep current code & results',
        clearEverything: 'Clear everything (fresh start)',
        clearHistoryOnly: 'Clear History Only',
        clearAll: 'Clear All',
        cancel: 'Cancel',
        confirm: 'Clear All',
        itemsCount: 'items',
        exportHistory: 'Export History',
        exporting: 'Exporting...',
        exportSuccess: 'Exported successfully!'
      },
      km: {
        reviewHistory: 'ប្រវត្តិការពិនិត្យ',
        noHistory: 'មិនទាន់មានប្រវត្តិការពិនិត្យទេ',
        noHistoryDescription: 'ប្រវត្តិការពិនិត្យកូដរបស់អ្នកនឹងបង្ហាញនៅទីនេះ បន្ទាប់ពីអ្នកវិភាគកូដខ្លះ។',
        clearHistory: 'លុបប្រវត្តិទាំងអស់',
        confirmClearHistory: 'នេះនឹងលុបការពិនិត្យកូដ {count} ដែលបានរក្សាទុកជាអចិន្ត្រៃយ៍។',
        clearDialogTitle: 'លុបប្រវត្តិការពិនិត្យទាំងអស់?',
        clearCurrentSessionQuestion: 'តើសម័យបច្ចុប្បន្នរបស់អ្នកវិញ?',
        keepCurrentSession: 'រក្សាកូដ និងលទ្ធផលបច្ចុប្បន្ន',
        clearEverything: 'លុបទាំងអស់ (ចាប់ផ្តើមថ្មី)',
        clearHistoryOnly: 'លុបតែប្រវត្តិ',
        clearAll: 'លុបទាំងអស់',
        cancel: 'បោះបង់',
        confirm: 'លុបទាំងអស់',
        itemsCount: 'ធាតុ',
        exportHistory: 'នាំចេញប្រវត្តិ',
        exporting: 'កំពុងនាំចេញ...',
        exportSuccess: 'នាំចេញបានជោគជ័យ!'
      }
    };
    return translations[language] || translations.en;
  };

  const t = getTranslations();

  const handleDeleteItem = (id: string) => {
    deleteHistoryItem(id);
    onHistoryChange();
  };

  const handleClearAll = () => {
    if (showClearConfirm) {
      clearAllHistory();
      onHistoryChange();

      if (clearOption === 'everything' && onClearCurrentSession) {
        onClearCurrentSession();
      }

      setShowClearConfirm(false);
      setClearOption('history-only');
    } else {
      setShowClearConfirm(true);
    }
  };

  const handleCancelClear = () => {
    setShowClearConfirm(false);
  };

  const handleViewItem = (item: CodeReviewHistoryItem) => {
    onViewItem(item);
    onClose();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportHistoryAsJSON();
      setTimeout(() => {
        setIsExporting(false);
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      <div className={`relative ${themeColors.backgroundSecondary} ${themeColors.border} shadow-2xl w-full max-w-2xl max-h-[80vh] lg:max-h-[85vh] rounded-t-xl lg:rounded-xl flex flex-col transform transition-transform duration-300 ease-out`}>
        <div className={`p-4 border-b ${themeColors.border} flex-shrink-0`}>
          <div className="flex justify-between items-center mb-3">
            <h3 className={`text-lg font-semibold ${themeColors.textSecondary}`}>
              {t.reviewHistory}
            </h3>
            <div className="flex items-center space-x-3">
              {history.length > 0 && (
                <span className={`text-sm ${themeColors.textMuted}`}>
                  {history.length} {t.itemsCount}
                </span>
              )}
              <button
                onClick={onClose}
                className={`p-1 ${themeColors.buttonSecondaryHover} rounded-full transition-colors`}
                title="Close"
              >
                <svg className={`w-5 h-5 ${themeColors.textMuted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`px-3 py-2 text-sm rounded transition-colors flex items-center ${
                  isExporting
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : `${themeColors.buttonPrimary} text-white`
                }`}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.exporting}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.exportHistory}
                  </>
                )}
              </button>

              {!showClearConfirm ? (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                >
                  {t.clearHistory}
                </button>
              ) : (
                <div className="w-full">
                  <div className={`${themeColors.backgroundTertiary} border border-red-500 rounded-lg p-4 mb-3`}>
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <h4 className="text-red-300 font-semibold text-sm">{t.clearDialogTitle}</h4>
                    </div>

                    <p className={`${themeColors.textSecondary} text-sm mb-4`}>
                      {t.confirmClearHistory.replace('{count}', history.length.toString())}
                    </p>

                    <div className="mb-4">
                      <p className={`${themeColors.textSecondary} text-sm mb-3 font-medium`}>{t.clearCurrentSessionQuestion}</p>

                      <div className="space-y-2">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="clearOption"
                            value="history-only"
                            checked={clearOption === 'history-only'}
                            onChange={(e) => setClearOption(e.target.value as 'history-only' | 'everything')}
                            className="mr-3 text-blue-600"
                          />
                          <span className={`${themeColors.textSecondary} text-sm`}>{t.keepCurrentSession}</span>
                        </label>

                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="clearOption"
                            value="everything"
                            checked={clearOption === 'everything'}
                            onChange={(e) => setClearOption(e.target.value as 'history-only' | 'everything')}
                            className="mr-3 text-blue-600"
                          />
                          <span className={`${themeColors.textSecondary} text-sm`}>{t.clearEverything}</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancelClear}
                        className={`px-3 py-2 border text-sm rounded transition-colors ${
                          themeColors.backgroundSecondary.includes('bg-white')
                            ? 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        {t.cancel}
                      </button>
                      <button
                        onClick={handleClearAll}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors"
                      >
                        {clearOption === 'history-only' ? t.clearHistoryOnly : t.clearAll}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="text-center py-8">
              <div className={`${themeColors.textMuted} mb-2`}>
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className={`${themeColors.textSecondary} font-medium mb-2`}>{t.noHistory}</h4>
              <p className={`${themeColors.textMuted} text-sm`}>{t.noHistoryDescription}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onView={handleViewItem}
                  onDelete={handleDeleteItem}
                  language={language}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
