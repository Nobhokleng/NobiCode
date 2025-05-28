
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  const { themeColors } = useTheme();

  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-lg font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out flex items-center justify-center
                  ${props.disabled ? `${themeColors.buttonSecondary} opacity-50 cursor-not-allowed` : 'hover:opacity-90 focus:ring-blue-400'}
                  ${className}`} // Allow additional classes to be passed
    >
      {children}
    </button>
  );
};
