import React, { useState, useEffect } from 'react';
import { Language } from '../types/services';
import { exportHistoryAsJSON } from '../utils/historyStorage';
import { useTheme } from '../contexts/ThemeContext';

interface HistoryWarningNotificationProps {
  isVisible: boolean;
  itemsCount: number;
  onClose: () => void;
  language: Language;
}

export const HistoryWarningNotification: React.FC<HistoryWarningNotificationProps> = ({
  isVisible,
  itemsCount,
  onClose,
  language
}) => {
  const { theme, themeColors } = useTheme();
  const [isExporting, setIsExporting] = useState(false);

  const getTranslations = () => {
    const translations = {
      en: {
        warningTitle: 'History Storage Warning',
        warningMessage: `You have ${itemsCount} code reviews saved. When you reach 50 items, older reviews will be automatically removed.`,
        exportButton: 'Export History',
        dismissButton: 'Got it',
        exportSuccess: 'History exported successfully!',
        exportError: 'Failed to export history. Please try again.',
        remaining: `${50 - itemsCount} slots remaining`
      },
      km: {
        warningTitle: 'ការព្រមានផ្ទុកប្រវត្តិ',
        warningMessage: `អ្នកមានការពិនិត្យកូដ ${itemsCount} ដែលបានរក្សាទុក។ នៅពេលអ្នកដល់ 50 ធាតុ ការពិនិត្យចាស់ៗនឹងត្រូវបានលុបដោយស្វ័យប្រវត្តិ។`,
        exportButton: 'នាំចេញប្រវត្តិ',
        dismissButton: 'យល់ហើយ',
        exportSuccess: 'នាំចេញប្រវត្តិបានជោគជ័យ!',
        exportError: 'បរាជ័យក្នុងការនាំចេញប្រវត្តិ។ សូមព្យាយាមម្តងទៀត។',
        remaining: `នៅសល់ ${50 - itemsCount} កន្លែង`
      }
    };
    return translations[language] || translations.en;
  };

  const t = getTranslations();

  const handleExport = async () => {
    setIsExporting(true);
    try {
      exportHistoryAsJSON();
      // Show success message briefly
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
      // Could show error toast here
    }
  };

  useEffect(() => {
    if (isVisible) {
      // Auto-dismiss after 10 seconds if user doesn't interact
      const timer = setTimeout(() => {
        onClose();
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className={`bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg shadow-2xl p-4 border border-yellow-500 ${theme === 'dark' ? 'shadow-black/50' : 'shadow-gray-500/50'}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-200 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h4 className="font-semibold text-sm">{t.warningTitle}</h4>
          </div>
          <button
            onClick={onClose}
            className="text-yellow-200 hover:text-white transition-colors ml-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-yellow-100 mb-3">
          {t.warningMessage}
        </p>

        {/* Remaining count */}
        <div className="text-xs text-yellow-200 mb-4 font-medium">
          {t.remaining}
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className={`
              flex-1 px-3 py-2 text-xs font-medium rounded transition-all duration-200
              ${isExporting
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-white text-orange-600 hover:bg-yellow-50 hover:shadow-md'
              }
            `}
          >
            {isExporting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t.exportSuccess}
              </div>
            ) : (
              <>
                <svg className="w-3 h-3 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.exportButton}
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-3 py-2 text-xs font-medium text-yellow-200 hover:text-white transition-colors"
          >
            {t.dismissButton}
          </button>
        </div>
      </div>
    </div>
  );
};
