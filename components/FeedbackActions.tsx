import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';

interface FeedbackActionsProps {
  feedback: string;
  language?: Language;
  onNewReview?: () => void;
}

export const FeedbackActions: React.FC<FeedbackActionsProps> = ({
  feedback,
  language = 'en',
  onNewReview
}) => {
  const { themeColors } = useTheme();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(feedback);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy feedback: ', err);
    }
  };

  const handleNewReview = () => {
    // Scroll to top of page for fresh start experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Call the onNewReview callback
    if (onNewReview) {
      onNewReview();
    }
  };

  return (
    <div className="mt-4 flex items-center justify-center gap-3">
      {/* Copy to clipboard */}
      <button
        onClick={copyToClipboard}
        className={`
          flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${copied
            ? `bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-500`
            : `${themeColors.buttonSecondary} ${themeColors.buttonSecondaryHover} ${themeColors.textSecondary} border ${themeColors.border} hover:scale-105 active:scale-95`
          }
        `}
        title={copied ? 'Copied!' : 'Copy to clipboard'}
      >
        {copied ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
        <span>{copied ? (t.copied || 'Copied!') : (t.copy || 'Copy')}</span>
      </button>

      {/* New review button */}
      {onNewReview && (
        <button
          onClick={handleNewReview}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${themeColors.buttonPrimary} ${themeColors.buttonPrimaryHover} text-white border border-transparent hover:scale-105 active:scale-95
          `}
          title="Start a new review"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{t.newReview || 'New Review'}</span>
        </button>
      )}
    </div>
  );
};
