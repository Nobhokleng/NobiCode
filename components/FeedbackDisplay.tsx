
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from '../contexts/ThemeContext';

interface FeedbackDisplayProps {
  feedback: string;
}

interface CodeBlockProps {
  children: string;
  className?: string;
  inline?: boolean;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  const { theme, themeColors } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const CodeBlock: React.FC<CodeBlockProps> = ({ children, className, inline }) => {
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
  };

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
          scrollBehavior: 'smooth'
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code: CodeBlock,
            h1: ({ children }) => (
              <h1 className={`text-2xl font-bold mt-8 mb-4 pb-2 border-b ${themeColors.border} ${themeColors.info} first:mt-0`}>
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className={`text-xl font-semibold mt-6 mb-3 ${themeColors.warning}`}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className={`text-lg font-semibold mt-5 mb-2 ${themeColors.accent}`}>
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4 className={`text-base font-semibold mt-4 mb-2 ${themeColors.textSecondary}`}>
                {children}
              </h4>
            ),
            p: ({ children }) => (
              <p className={`mb-4 leading-relaxed ${themeColors.textSecondary}`}>
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className={`mb-4 ml-6 space-y-1 list-disc ${themeColors.textSecondary}`}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className={`mb-4 ml-6 space-y-1 list-decimal ${themeColors.textSecondary}`}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="leading-relaxed">
                {children}
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-4 ${themeColors.border} pl-4 py-2 my-4 ${themeColors.backgroundSecondary} rounded-r italic`}>
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-4">
                <table className={`min-w-full border ${themeColors.border} rounded-lg overflow-hidden`}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className={`${themeColors.backgroundSecondary}`}>
                {children}
              </thead>
            ),
            th: ({ children }) => (
              <th className={`px-4 py-2 text-left font-semibold border-b ${themeColors.border} ${themeColors.textSecondary}`}>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className={`px-4 py-2 border-b ${themeColors.border} ${themeColors.textSecondary}`}>
                {children}
              </td>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${themeColors.accentHover} underline hover:no-underline transition-colors`}
              >
                {children}
              </a>
            ),
            strong: ({ children }) => (
              <strong className={`font-semibold ${themeColors.textPrimary}`}>
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className={`italic ${themeColors.textSecondary}`}>
                {children}
              </em>
            ),
            hr: () => (
              <hr className={`my-6 border-t ${themeColors.border}`} />
            ),
          }}
        >
          {feedback}
        </ReactMarkdown>
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
