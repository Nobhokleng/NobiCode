
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ErrorMessageProps {
  message: string | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  const { themeColors } = useTheme();

  if (!message) {
    return null;
  }

  return (
    <div
      className={`p-4 ${themeColors.error} rounded-lg shadow-md`}
      role="alert"
    >
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-.5-5h1v1h-1v-1zm0-8h1v6h-1V5z"/>
        </svg>
        <strong className="font-semibold">Error:</strong>
      </div>
      <p className="mt-1 ml-7 text-sm">{message}</p>
    </div>
  );
};