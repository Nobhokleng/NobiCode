import { Theme, ThemeColors } from '../types/services';

export const THEME_COLORS: Record<Theme, ThemeColors> = {
  dark: {
    // Background colors
    background: 'from-gray-900 to-gray-800',
    backgroundSecondary: 'bg-gray-800',
    backgroundTertiary: 'bg-gray-900',
    
    // Text colors
    textPrimary: 'text-gray-100',
    textSecondary: 'text-gray-200',
    textMuted: 'text-gray-400',
    
    // Border colors
    border: 'border-gray-700',
    borderFocus: 'focus:border-blue-500',
    
    // Button colors
    buttonPrimary: 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700',
    buttonPrimaryHover: 'hover:from-blue-600 hover:to-purple-700',
    buttonSecondary: 'bg-gray-600 hover:bg-gray-700',
    buttonSecondaryHover: 'hover:bg-gray-700',
    
    // Status colors
    success: 'text-emerald-300',
    warning: 'text-yellow-300',
    error: 'bg-red-700 border-red-900 text-red-100',
    info: 'text-blue-300',
    
    // Accent colors
    accent: 'text-accent',
    accentHover: 'hover:text-emerald-400'
  },
  light: {
    // Background colors
    background: 'from-blue-50 to-indigo-100',
    backgroundSecondary: 'bg-white',
    backgroundTertiary: 'bg-gray-50',
    
    // Text colors
    textPrimary: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    
    // Border colors
    border: 'border-gray-300',
    borderFocus: 'focus:border-blue-500',
    
    // Button colors
    buttonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800',
    buttonPrimaryHover: 'hover:from-blue-700 hover:to-purple-800',
    buttonSecondary: 'bg-gray-200 hover:bg-gray-300',
    buttonSecondaryHover: 'hover:bg-gray-300',
    
    // Status colors
    success: 'text-emerald-600',
    warning: 'text-yellow-600',
    error: 'bg-red-100 border-red-300 text-red-800',
    info: 'text-blue-600',
    
    // Accent colors
    accent: 'text-emerald-600',
    accentHover: 'hover:text-emerald-700'
  }
};

// Helper function to get theme classes
export const getThemeClasses = (theme: Theme) => THEME_COLORS[theme];

// Default theme
export const DEFAULT_THEME: Theme = 'dark';
