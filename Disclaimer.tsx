import React, { useState } from 'react';

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

export const Disclaimer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-yellow-50/95 dark:bg-yellow-900/90 backdrop-blur-sm border-t border-yellow-200 dark:border-yellow-800 p-4 z-20 shadow-lg">
      <div className="container mx-auto flex items-start gap-4">
        <InfoIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
        <div className="flex-grow">
          <h4 className="font-bold text-yellow-800 dark:text-yellow-200">Disclaimer</h4>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            Legal Ease AI is an experimental tool and not a substitute for professional legal advice. The analysis provided is for informational purposes only. For critical matters, please consult a qualified lawyer.
          </p>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="text-yellow-800 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-800 p-1 rounded-full transition-colors"
          aria-label="Dismiss disclaimer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};