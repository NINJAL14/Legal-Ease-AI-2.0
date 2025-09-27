import React from 'react';
import type { LanguageCode } from '../types';
import { supportedLanguages } from '../types';

interface HeaderProps {
  selectedLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
  isAnalyzing: boolean;
}

const LawGavelIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M11.625 16.5a1.875 1.875 0 100-3.75 1.875 1.875 0 000 3.75z" />
    <path
      fillRule="evenodd"
      d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036-.84-1.875-1.875-1.875H5.625zM12.75 18a.75.75 0 00.75-.75v-3a.75.75 0 00-1.5 0v3a.75.75 0 00.75.75z"
      clipRule="evenodd"
    />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ selectedLanguage, onLanguageChange, isAnalyzing }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LawGavelIcon className="h-8 w-8 text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Legal Ease AI
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="language-select" className="text-sm font-medium text-gray-600 dark:text-gray-300 sr-only">Language</label>
          <select
            id="language-select"
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
            disabled={isAnalyzing}
            className="bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2 disabled:opacity-50 transition-colors"
          >
            {Object.entries(supportedLanguages).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
};