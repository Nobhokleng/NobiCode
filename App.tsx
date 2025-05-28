
import React, { useState, useCallback, useEffect, useTransition, useRef } from 'react';
import { CodeInput } from './components/CodeInput';

import { StreamingFeedbackDisplay } from './components/StreamingFeedbackDisplay';
import { StreamingToggle } from './components/StreamingToggle';
import { LoadingDisplay } from './components/LoadingDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { FeedbackActions } from './components/FeedbackActions';
import { Button } from './components/Button';
import { LoadingSpinner } from './components/LoadingSpinner';

import { ServiceSelector } from './components/ServiceSelector';
import { ModelSelector } from './components/ModelSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { ThemeToggle } from './components/ThemeToggle';
import { HistoryButton } from './components/HistoryButton';
import { HistoryPanel } from './components/HistoryPanel';
import { HistoryWarningNotification } from './components/HistoryWarningNotification';
import { reviewCodeWithGemini, reviewCodeWithGeminiStreaming } from './services/geminiService';
import { reviewCodeWithOpenRouter, reviewCodeWithOpenRouterStreaming } from './services/openrouterService';
import { AIService, ModelConfiguration, Language, CodeReviewHistoryItem, StreamingOptions } from './types/services';
import { getStoredService, setStoredService, getStoredModelConfig, setStoredModelConfig, getStoredLanguage, setStoredLanguage, getStoredStreamingEnabled, setStoredStreamingEnabled } from './utils/storage';
import { getReviewHistory, saveReviewToHistory } from './utils/historyStorage';
import { UI_TRANSLATIONS } from './constants/languages';
import { useTheme } from './contexts/ThemeContext';
// APP_TITLE is "NobiCode", but we'll construct the logo visually
import { GithubIcon } from './components/Icons';

const App: React.FC = () => {
  const { themeColors } = useTheme();
  const [codeToReview, setCodeToReview] = useState<string>('');
  const [reviewFeedback, setReviewFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<AIService>(() => getStoredService());
  const [modelConfig, setModelConfig] = useState<ModelConfiguration>(() => getStoredModelConfig());
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => getStoredLanguage());
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Streaming-related state
  const [isStreamingEnabled, setIsStreamingEnabled] = useState<boolean>(() => getStoredStreamingEnabled());
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [streamingFeedback, setStreamingFeedback] = useState<string>('');
  const [wasCancelled, setWasCancelled] = useState<boolean>(false);

  // Performance optimization hooks
  const [, startTransition] = useTransition();
  const rafIdRef = useRef<number | null>(null);
  const accumulatedTextRef = useRef<string>('');

  // History-related state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [reviewHistory, setReviewHistory] = useState<CodeReviewHistoryItem[]>(() => getReviewHistory());
  const [showWarningNotification, setShowWarningNotification] = useState<boolean>(false);
  const [warningItemsCount, setWarningItemsCount] = useState<number>(0);

  // Sticky header scroll state
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // Save preferences to localStorage when they change
  useEffect(() => {
    setStoredService(selectedService);
  }, [selectedService]);

  useEffect(() => {
    setStoredModelConfig(modelConfig);
  }, [modelConfig]);

  useEffect(() => {
    setStoredLanguage(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    setStoredStreamingEnabled(isStreamingEnabled);
  }, [isStreamingEnabled]);

  // Scroll detection for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleServiceChange = (service: AIService) => {
    setSelectedService(service);
    setError(null);
    setReviewFeedback(null);
  };

  const handleModelChange = (model: string) => {
    setModelConfig(prev => ({
      ...prev,
      [selectedService]: model
    }));
    setError(null);
    setReviewFeedback(null);
  };

  const handleLanguageChange = (language: Language) => {
    setSelectedLanguage(language);
    setError(null);
    setReviewFeedback(null);
  };

  // Streaming-related handlers
  const handleStreamingToggle = (enabled: boolean) => {
    // Use transition for non-urgent streaming toggle to prevent lag
    startTransition(() => {
      setIsStreamingEnabled(enabled);
      // Don't clear existing results when toggling streaming mode
      // Only clear error state
      setError(null);
    });
  };

  // History-related handlers
  const handleToggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleHistoryChange = () => {
    setReviewHistory(getReviewHistory());
  };

  const handleViewHistoryItem = (item: CodeReviewHistoryItem) => {
    setCodeToReview(item.code);
    setReviewFeedback(item.response);
    setSelectedService(item.service);
    setModelConfig(prev => ({
      ...prev,
      [item.service]: item.model
    }));
    setSelectedLanguage(item.language);
    setError(null);
  };

  const handleClearCurrentSession = () => {
    setCodeToReview('');
    setReviewFeedback(null);
    setStreamingFeedback('');
    setError(null);
    setWasCancelled(false);
  };

  // App name click handler - combines clear session and scroll to top
  const handleAppNameClick = () => {
    // Scroll to top of page for fresh start experience
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Clear current session
    handleClearCurrentSession();
  };

  const handleCancelReview = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      setIsLoading(false);

      // Cancel any pending RAF updates
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // If we have streaming content, preserve it and mark as cancelled
      if (isStreaming && streamingFeedback) {
        setIsStreaming(false);
        setReviewFeedback(streamingFeedback); // Preserve the partial response
        setWasCancelled(true); // Mark as cancelled for UI indication
        // Don't show error, just keep the partial content
      } else {
        // Only show error if no streaming content was received
        setIsStreaming(false);
        setError(t.reviewCancelled);
      }
    }
  };

  // Get current translations
  const t = UI_TRANSLATIONS[selectedLanguage] || UI_TRANSLATIONS.en;

  const handleReviewRequest = useCallback(async () => {
    if (!codeToReview.trim()) {
      setError(t.enterCodePrompt);
      return;
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    setAbortController(controller);
    setIsLoading(true);
    setError(null);
    setReviewFeedback(null);
    setStreamingFeedback('');
    setWasCancelled(false);

    try {
      let feedback: string;
      const currentModel = modelConfig[selectedService];

      if (isStreamingEnabled) {
        // Use streaming with performance optimizations
        setIsStreaming(true);

        // Reset accumulated text for new request
        accumulatedTextRef.current = '';

        // RequestAnimationFrame batching for smooth updates
        const batchedUpdate = () => {
          startTransition(() => {
            setStreamingFeedback(accumulatedTextRef.current);
          });
          rafIdRef.current = null;
        };

        const streamingOptions: StreamingOptions = {
          enabled: true,
          onChunk: (chunk: string) => {
            // Accumulate chunks in ref (no re-renders)
            accumulatedTextRef.current += chunk;

            // Batch updates with requestAnimationFrame for smooth performance
            if (!rafIdRef.current) {
              rafIdRef.current = requestAnimationFrame(batchedUpdate);
            }
          },
          onComplete: (fullResponse: string) => {
            // Cancel any pending RAF update
            if (rafIdRef.current) {
              cancelAnimationFrame(rafIdRef.current);
              rafIdRef.current = null;
            }

            // Use transition for non-urgent final update
            startTransition(() => {
              setIsStreaming(false);
              setReviewFeedback(fullResponse);
              setStreamingFeedback(''); // Clear streaming state
            });
          },
          onError: (error: Error) => {
            // Cancel any pending RAF update
            if (rafIdRef.current) {
              cancelAnimationFrame(rafIdRef.current);
              rafIdRef.current = null;
            }

            setIsStreaming(false);
            console.error("Streaming error:", error);
          }
        };

        if (selectedService === 'gemini') {
          feedback = await reviewCodeWithGeminiStreaming(codeToReview, currentModel, selectedLanguage, streamingOptions, controller.signal);
        } else {
          feedback = await reviewCodeWithOpenRouterStreaming(codeToReview, currentModel, selectedLanguage, streamingOptions, controller.signal);
        }
      } else {
        // Use regular non-streaming
        if (selectedService === 'gemini') {
          feedback = await reviewCodeWithGemini(codeToReview, currentModel, selectedLanguage, controller.signal);
        } else {
          feedback = await reviewCodeWithOpenRouter(codeToReview, currentModel, selectedLanguage, controller.signal);
        }
        setReviewFeedback(feedback);
      }

      // Save to history and check for warning
      const saveResult = saveReviewToHistory(
        codeToReview,
        feedback,
        selectedService,
        currentModel,
        selectedLanguage
      );

      // Update history state
      setReviewHistory(getReviewHistory());

      // Show warning notification if needed
      if (saveResult.shouldShowWarning) {
        setWarningItemsCount(saveResult.itemsCount);
        setShowWarningNotification(true);
      }
    } catch (err) {
      if (err instanceof Error) {
        // Check if the error is due to cancellation
        if (err.message.includes("Request was cancelled") || controller.signal.aborted) {
          // If we have streaming content, preserve it instead of showing error
          if (isStreamingEnabled && streamingFeedback) {
            setReviewFeedback(streamingFeedback);
            setWasCancelled(true); // Mark as cancelled for UI indication
            // Don't set error, just preserve the partial content
          } else {
            setError(t.reviewCancelled);
          }
        } else {
          setError(err.message);
        }
      } else {
        setError(t.unknownError);
      }
      console.error("Review request failed:", err);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setAbortController(null);
    }
  }, [codeToReview, selectedService, modelConfig, selectedLanguage, isStreamingEnabled, t]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeColors.background} ${themeColors.textPrimary} flex flex-col`}>
      {/* Sticky Header - Fixed Implementation */}
      <header className={`
        sticky top-0 z-50 w-full transition-all duration-200 ease-in-out
        ${isScrolled
          ? `${themeColors.backgroundSecondary} shadow-md`
          : 'bg-transparent'
        }
      `}>
        <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-200 ${isScrolled ? 'py-3' : 'py-6'}`}>
            <div className="flex-1 flex justify-start">
              <HistoryButton
                isHistoryOpen={isHistoryOpen}
                onToggleHistory={handleToggleHistory}
                historyCount={reviewHistory.length}
                language={selectedLanguage}
                disabled={isLoading}
              />
            </div>
            <div className="text-center flex-1">
              <h1
                className={`font-bold cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 ${
                  isScrolled ? 'text-xl sm:text-2xl' : 'text-4xl sm:text-5xl'
                }`}
                onClick={handleAppNameClick}
                title="Click to start a new review"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Nobi</span><span className={themeColors.accent}>Code</span>
              </h1>
            </div>
            <div className="flex-1 flex justify-end items-center space-x-3">
              <ThemeToggle
                language={selectedLanguage}
              />
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                disabled={isLoading}
              />
            </div>
          </div>
          {/* App description - completely removed when scrolled */}
          <div className={`transition-all duration-200 ease-in-out overflow-hidden ${
            !isScrolled
              ? 'max-h-20 opacity-100 pb-6'
              : 'max-h-0 opacity-0 pb-0'
          }`}>
            <p className={`text-lg ${themeColors.textMuted} text-center`}>
              {t.appDescription}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 flex-1">
        {/* Add padding to prevent overlap with sticky header */}
        <div className={`w-full max-w-5xl transition-all duration-200 ${!isScrolled ? 'mt-12 pt-6' : 'mt-12 pt-12'}`}>

        <main className={`w-full max-w-5xl ${themeColors.backgroundSecondary} shadow-2xl rounded-xl p-6 sm:p-8`}>
        <ServiceSelector
          selectedService={selectedService}
          onServiceChange={handleServiceChange}
          disabled={isLoading}
          language={selectedLanguage}
        />

        <ModelSelector
          selectedService={selectedService}
          selectedModel={modelConfig[selectedService]}
          onModelChange={handleModelChange}
          disabled={isLoading}
          language={selectedLanguage}
        />

        <StreamingToggle
          enabled={isStreamingEnabled}
          onToggle={handleStreamingToggle}
          disabled={isLoading}
          language={selectedLanguage}
        />

        <CodeInput
          value={codeToReview}
          onChange={(e) => setCodeToReview(e.target.value)}
          disabled={isLoading}
          language={selectedLanguage}
        />

        <div className="mt-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleReviewRequest}
              disabled={isLoading || !codeToReview.trim()}
              className={`w-full sm:w-auto ${themeColors.buttonPrimary} text-white font-semibold`}
            >
              {isLoading ? t.analyzing : t.reviewButton}
              {isLoading && <LoadingSpinner className="w-5 h-5 ml-2 inline-block" />}
            </Button>

            {isLoading && (
              <Button
                onClick={handleCancelReview}
                className="w-full sm:w-auto px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                {t.cancelReview}
              </Button>
            )}
          </div>
        </div>

        {/* Loading State - Only show when not streaming */}
        {isLoading && !isStreaming && (
          <div className="mt-8">
            <LoadingDisplay language={selectedLanguage} />
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="mt-8">
            <ErrorDisplay
              error={error}
              onRetry={handleReviewRequest}
              language={selectedLanguage}
            />
          </div>
        )}

        {/* Unified Feedback Display - Handles both streaming and completed states */}
        {(isStreaming || reviewFeedback) && !error && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-semibold ${themeColors.textSecondary}`}>
                {t.reviewResults}
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <span className={`px-2 py-1 rounded ${themeColors.backgroundSecondary} ${themeColors.textMuted}`}>
                  {selectedService === 'gemini' ? 'Gemini' : 'OpenRouter'}
                </span>
                <span className={`px-2 py-1 rounded ${themeColors.backgroundSecondary} ${themeColors.textMuted}`}>
                  {modelConfig[selectedService]}
                </span>
                {isStreaming && (
                  <span className={`px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs`}>
                    {t.streamingStatus}
                  </span>
                )}
                {!isStreaming && reviewFeedback && isStreamingEnabled && !wasCancelled && (
                  <span className={`px-2 py-1 rounded bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs`}>
                    {t.streamedStatus}
                  </span>
                )}
                {wasCancelled && (
                  <span className={`px-2 py-1 rounded bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs`}>
                    {t.cancelledPartialStatus}
                  </span>
                )}
              </div>
            </div>

            <StreamingFeedbackDisplay
              feedback={isStreaming ? (streamingFeedback || '') : (reviewFeedback || '')}
              isStreaming={isStreaming}
              wasCancelled={wasCancelled}
              language={selectedLanguage}
            />

            {/* Show minimal actions when review is complete */}
            {!isStreaming && reviewFeedback && (
              <FeedbackActions
                feedback={reviewFeedback}
                language={selectedLanguage}
                onNewReview={handleClearCurrentSession}
              />
            )}
          </div>
        )}

        {/* Ready to Analyze State */}
        {!isLoading && !reviewFeedback && !streamingFeedback && !error && codeToReview && !isStreaming && (
          <div className={`mt-8 text-center ${themeColors.textMuted}`}>
            <div className="flex flex-col items-center space-y-3">
              <svg className="w-12 h-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium">{t.readyToAnalyze}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !reviewFeedback && !streamingFeedback && !error && !codeToReview && !isStreaming && (
          <div className={`mt-8 text-center ${themeColors.textMuted}`}>
            <div className="flex flex-col items-center space-y-4">
              <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div>
                <p className="text-lg font-medium mb-2">{t.enterCodeToStart}</p>
              </div>
              <div className={`mt-4 p-4 ${themeColors.backgroundSecondary} rounded-lg border ${themeColors.border} max-w-md`}>
                <h4 className={`font-semibold ${themeColors.textSecondary} mb-2`}>{t.quickTips}</h4>
                <ul className={`text-sm ${themeColors.textMuted} space-y-1`}>
                  <li>• {t.quickTip1}</li>
                  <li>• {t.quickTip2}</li>
                  <li>• {t.quickTip3}</li>
                  <li>• {t.quickTip4}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className={`w-full max-w-5xl mt-12 text-center ${themeColors.textMuted}`}>
        <p>{t.poweredBy} {selectedService === 'gemini' ? 'Gemini API' : 'OpenRouter API'}</p>
        <p className="text-xs mt-1">{t.currentModel}: {modelConfig[selectedService]}</p>
        <div className="flex justify-center space-x-6 mt-2">
          <a
            href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center ${themeColors.accentHover} transition-colors`}
          >
            <GithubIcon className="w-4 h-4 mr-1" />
            {t.geminiDocs}
          </a>
          <a
            href="https://openrouter.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center ${themeColors.accentHover} transition-colors`}
          >
            <GithubIcon className="w-4 h-4 mr-1" />
            {t.openrouterDocs}
          </a>
        </div>
      </footer>
      </div>
      </div>

      {/* History Panel Modal */}
      <HistoryPanel
        isOpen={isHistoryOpen}
        history={reviewHistory}
        onHistoryChange={handleHistoryChange}
        onViewItem={handleViewHistoryItem}
        onClearCurrentSession={handleClearCurrentSession}
        language={selectedLanguage}
        onClose={handleToggleHistory}
      />

      {/* Warning Notification */}
      <HistoryWarningNotification
        isVisible={showWarningNotification}
        itemsCount={warningItemsCount}
        onClose={() => setShowWarningNotification(false)}
        language={selectedLanguage}
      />
    </div>
  );
};

export default App;
