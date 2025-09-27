import React, { useState } from 'react';
import type { AnalysisResult, KeyClause, RiskFlag } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SidebarProps {
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  fileName: string | null;
}

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-md transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
};

const ClauseCard: React.FC<{ item: KeyClause | RiskFlag; type: 'clause' | 'risk' }> = ({ item, type }) => (
  <div className="p-3 mb-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
    <h4 className="font-semibold text-gray-900 dark:text-white">
      {type === 'clause' ? (item as KeyClause).clause : (item as RiskFlag).risk}
    </h4>
    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{(item as any).explanation}</p>
    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-mono">Citation: {item.citation}</p>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ analysisResult, isAnalyzing, fileName }) => {
  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Contract Analysis</h2>
        {fileName && <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{fileName}</p>}
      </div>
      <div className="flex-grow overflow-y-auto">
        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <SpinnerIcon className="w-8 h-8 text-indigo-500" />
            <p className="mt-4 font-semibold text-gray-700 dark:text-gray-200">Analyzing Document...</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
          </div>
        )}
        {!isAnalyzing && !analysisResult && (
          <div className="flex items-center justify-center h-full p-4 text-center">
            <p className="text-gray-500 dark:text-gray-400">Upload a contract to see the analysis here.</p>
          </div>
        )}
        {analysisResult && (
          <div>
            <Section title="Simplified Summary">
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{analysisResult.summary}</p>
            </Section>
            <Section title="Key Clauses">
              {analysisResult.keyClauses.map((item, index) => (
                <ClauseCard key={index} item={item} type="clause" />
              ))}
            </Section>
            <Section title="Risk Flags">
              {analysisResult.riskFlags.map((item, index) => (
                <ClauseCard key={index} item={item} type="risk" />
              ))}
            </Section>
          </div>
        )}
      </div>
    </aside>
  );
};