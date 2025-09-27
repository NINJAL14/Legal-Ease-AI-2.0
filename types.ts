
export interface KeyClause {
  clause: string;
  explanation: string;
  citation: string;
}

export interface RiskFlag {
  risk: string;
  explanation: string;
  citation: string;
}

export interface AnalysisResult {
  summary: string;
  keyClauses: KeyClause[];
  riskFlags: RiskFlag[];
}

export enum MessageSender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isError?: boolean;
}

export const supportedLanguages = {
  en: 'English',
  hi: 'हिन्दी (Hindi)',
  mr: 'मराठी (Marathi)',
  es: 'Español (Spanish)',
  fr: 'Français (French)',
};

export type LanguageCode = keyof typeof supportedLanguages;
