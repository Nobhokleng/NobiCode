import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types/services';
import { UI_TRANSLATIONS } from '../constants/languages';

interface StreamingFeedbackDisplayProps {
  feedback: string;
  isStreaming?: boolean;
  wasCancelled?: boolean;
  language?: Language;
}

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

interface MemoizedMarkdownProps {
  feedback: string;
  themeColors: any;
  theme: string;
  copiedCode: string | null;
  copyToClipboard: (text: string) => void;
}

// Memoized markdown component to prevent unnecessary re-renders with intelligent optimization
const MemoizedMarkdown = React.memo<MemoizedMarkdownProps>(({ feedback, themeColors, theme, copiedCode, copyToClipboard }) => {
  const CodeBlock: React.FC<CodeBlockProps> = useCallback(({ children, className, inline }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    if (inline) {
      return (
        <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${themeColors.backgroundSecondary} ${themeColors.accent} border ${themeColors.border}`}>
          {children}
        </code>
      );
    }

    const codeString = String(children).replace(/\n$/, '');
    const isCopied = copiedCode === codeString;

    return (
      <div className="relative group my-4">
        <div className={`absolute top-2 right-2 z-10 flex items-center space-x-2`}>
          {language && (
            <span className={`px-2 py-1 text-xs font-medium rounded ${themeColors.backgroundSecondary} ${themeColors.textMuted} border ${themeColors.border}`}>
              {language}
            </span>
          )}
          <button
            onClick={() => copyToClipboard(codeString)}
            className={`px-2 py-1 text-xs font-medium rounded transition-all duration-200 ${
              isCopied
                ? `${themeColors.success} bg-green-100 dark:bg-green-900`
                : `${themeColors.buttonSecondary} ${themeColors.buttonSecondaryHover} opacity-0 group-hover:opacity-100`
            }`}
            title={isCopied ? 'Copied!' : 'Copy code'}
          >
            {isCopied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
        <SyntaxHighlighter
          style={theme === 'dark' ? oneDark : oneLight}
          language={language || 'text'}
          PreTag="div"
          className="!mt-0 !mb-0 rounded-lg border"
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.5',
          }}
          codeTagProps={{
            style: {
              fontFamily: 'Fira Code, Monaco, Consolas, monospace',
            }
          }}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }, [theme, themeColors, copiedCode, copyToClipboard]);

  const markdownComponents = useMemo(() => ({
    code: CodeBlock,
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className={`text-2xl font-bold mt-8 mb-4 pb-2 border-b ${themeColors.border} ${themeColors.info} first:mt-0`}>
        {children}
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className={`text-xl font-semibold mt-6 mb-3 ${themeColors.warning}`}>
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className={`text-lg font-semibold mt-5 mb-2 ${themeColors.accent}`}>
        {children}
      </h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className={`text-base font-semibold mt-4 mb-2 ${themeColors.textSecondary}`}>
        {children}
      </h4>
    ),
    p: ({ children }: { children: React.ReactNode }) => (
      <p className={`mb-4 leading-relaxed ${themeColors.textSecondary}`}>
        {children}
      </p>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className={`mb-4 ml-6 space-y-1 list-disc ${themeColors.textSecondary}`}>
        {children}
      </ul>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className={`mb-4 ml-6 space-y-1 list-decimal ${themeColors.textSecondary}`}>
        {children}
      </ol>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="leading-relaxed">
        {children}
      </li>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className={`border-l-4 ${themeColors.border} pl-4 py-2 my-4 ${themeColors.backgroundSecondary} rounded-r italic`}>
        {children}
      </blockquote>
    ),
    table: ({ children }: { children: React.ReactNode }) => (
      <div className="overflow-x-auto my-4">
        <table className={`min-w-full border ${themeColors.border} rounded-lg overflow-hidden`}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: { children: React.ReactNode }) => (
      <thead className={`${themeColors.backgroundSecondary}`}>
        {children}
      </thead>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className={`px-4 py-2 text-left font-semibold border-b ${themeColors.border} ${themeColors.textSecondary}`}>
        {children}
      </th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className={`px-4 py-2 border-b ${themeColors.border} ${themeColors.textSecondary}`}>
        {children}
      </td>
    ),
    a: ({ href, children }: { href?: string; children: React.ReactNode }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${themeColors.accentHover} underline hover:no-underline transition-colors`}
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className={`font-semibold ${themeColors.textPrimary}`}>
        {children}
      </strong>
    ),
    em: ({ children }: { children: React.ReactNode }) => (
      <em className={`italic ${themeColors.textSecondary}`}>
        {children}
      </em>
    ),
    hr: () => (
      <hr className={`my-6 border-t ${themeColors.border}`} />
    ),
  }), [themeColors, CodeBlock]);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={markdownComponents}
    >
      {feedback}
    </ReactMarkdown>
  );
}, (prevProps, nextProps) => {
  // Check if theme or theme colors changed (this will detect theme switches)
  if (prevProps.theme !== nextProps.theme || prevProps.themeColors !== nextProps.themeColors) {
    return false; // Re-render when theme changes
  }

  // Check if copy state changed
  if (prevProps.copiedCode !== nextProps.copiedCode) {
    return false; // Re-render when copy state changes
  }

  // Only re-render if feedback content actually changed
  // For large content, be more conservative about re-renders to prevent lag
  const isLargeContent = nextProps.feedback.length > 8000;

  if (isLargeContent) {
    // For large content, only re-render if there's a significant change
    const significantChange = Math.abs(nextProps.feedback.length - prevProps.feedback.length) > 500;
    return !significantChange && prevProps.feedback === nextProps.feedback;
  }

  return prevProps.feedback === nextProps.feedback;
});

export const StreamingFeedbackDisplay: React.FC<StreamingFeedbackDisplayProps> = ({
  feedback,
  isStreaming = false,
  wasCancelled = false,
  language = 'en'
}) => {
  const { theme, themeColors } = useTheme();
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [debouncedFeedback, setDebouncedFeedback] = useState(feedback);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const layoutOptimizationRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced markdown updates for smooth streaming with rich formatting
  useEffect(() => {
    if (isStreaming) {
      // During streaming: debounce markdown updates for performance
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Use longer debounce for large content to prevent lag
      const isLargeContent = feedback.length > 5000; // 5KB threshold for debouncing
      const debounceDelay = isLargeContent ? 300 : 150; // Longer delay for large content

      debounceTimeoutRef.current = setTimeout(() => {
        setDebouncedFeedback(feedback);
      }, debounceDelay);
    } else {
      // When not streaming: immediate update
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      setDebouncedFeedback(feedback);
    }

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [feedback, isStreaming]);

  // Optimize layout after streaming completes
  useEffect(() => {
    if (!isStreaming && feedback) {
      // Clear any existing optimization timeout
      if (layoutOptimizationRef.current) {
        clearTimeout(layoutOptimizationRef.current);
      }

      // Skip expensive layout optimization for large content to prevent lag
      const isLargeContent = feedback.length > 10000; // 10KB threshold

      if (!isLargeContent) {
        // Trigger layout optimization after a short delay
        layoutOptimizationRef.current = setTimeout(() => {
          if (containerRef.current) {
            // Force layout calculation to prevent first-scroll lag
            const container = containerRef.current;

            // Trigger reflow in a controlled way
            requestAnimationFrame(() => {
              // Read layout properties to force calculation
              const height = container.scrollHeight;
              const width = container.scrollWidth;

              // Optimize will-change property
              container.style.willChange = 'auto';

              // Optional: Pre-warm scroll position calculation
              container.scrollTop = container.scrollTop;
            });
          }
        }, 300); // Wait for markdown rendering to settle
      }
    }

    return () => {
      if (layoutOptimizationRef.current) {
        clearTimeout(layoutOptimizationRef.current);
      }
    };
  }, [isStreaming, feedback]);

  // Optimized scroll handling with throttling and RAF
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number | null = null;
    let isScrolling = false;

    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;

        if (rafId) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          setShowScrollTop(container.scrollTop > 300);
          isScrolling = false;
          rafId = null;
        });
      }
    };

    // Use passive listeners for better performance
    container.addEventListener('scroll', handleScroll, {
      passive: true,
      capture: false
    });

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  const scrollToTop = useCallback(() => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`
          p-6 ${themeColors.backgroundTertiary} ${themeColors.textSecondary}
          rounded-lg shadow-inner border ${themeColors.border}
          overflow-y-auto max-h-[70vh]
          prose prose-sm sm:prose lg:prose-lg max-w-none
          ${theme === 'dark' ? 'prose-invert' : ''}
        `}
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          lineHeight: '1.7',
          // Hardware acceleration for smooth scrolling
          transform: 'translateZ(0)',
          willChange: 'scroll-position',
          // Optimize rendering
          contain: 'layout style paint',
          // Smooth scrolling
          scrollBehavior: 'auto', // Disable smooth scroll for better performance
          // Optimize repaints
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        {/* Show minimal streaming indicator only when no content yet */}
        {isStreaming && !feedback && (
          <div className={`flex items-center justify-center space-x-3 p-6 ${themeColors.backgroundSecondary} rounded-lg mb-4`}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className={`text-sm ${themeColors.textMuted}`}>
              {t.aiAnalyzingMessage}
            </span>
          </div>
        )}

        {/* Rich markdown rendering with streaming optimization */}
        <div
          className="relative"
          style={{
            // Optimize rendering performance
            contain: 'layout style',
            // Hardware acceleration
            transform: 'translateZ(0)',
            // Use consistent willChange to prevent repaints when toggling
            willChange: 'auto'
          }}
        >
          <div
            style={{
              // Optimize markdown container
              contain: 'layout style paint',
              // Prevent reflow issues
              minHeight: '1rem'
            }}
          >
            <MemoizedMarkdown
              feedback={debouncedFeedback}
              themeColors={themeColors}
              theme={theme}
              copiedCode={copiedCode}
              copyToClipboard={copyToClipboard}
            />
          </div>

          {/* Show live streaming text that hasn't been rendered yet - simplified */}
          {isStreaming && feedback !== debouncedFeedback && feedback && (
            <div
              className={`mt-2 p-3 rounded ${themeColors.backgroundSecondary} border-l-4 border-blue-500`}
              style={{
                // Optimize streaming section
                contain: 'layout style paint',
                transform: 'translateZ(0)'
              }}
            >
              <div
                className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${themeColors.textMuted}`}
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  // Optimize text rendering
                  contain: 'style',
                  wordBreak: 'break-word'
                }}
              >
                {feedback.slice(debouncedFeedback.length)}
              </div>
            </div>
          )}
        </div>

        {/* Cancellation notice */}
        {wasCancelled && !isStreaming && (
          <div className={`mt-6 p-4 rounded-lg border-l-4 border-orange-500 ${themeColors.backgroundSecondary}`}>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <p className={`text-sm font-medium text-orange-800 dark:text-orange-200`}>
                  {t.reviewCancelledTitle}
                </p>
                <p className={`text-xs ${themeColors.textMuted} mt-1`}>
                  {t.reviewCancelledDescription}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Subtle streaming cursor - only when content is being generated */}
        {isStreaming && feedback && (
          <div className="flex items-center mt-3">
            <span
              className={`inline-block w-2 h-4 mr-2 ${themeColors.accent} animate-pulse`}
              style={{ backgroundColor: 'currentColor' }}
            />
          </div>
        )}
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`
            absolute bottom-4 right-4 p-2 rounded-full shadow-lg
            ${themeColors.buttonPrimary} ${themeColors.buttonPrimaryHover}
            transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
          `}
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
};
