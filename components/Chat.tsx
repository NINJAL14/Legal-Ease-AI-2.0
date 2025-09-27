import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { MessageSender } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';

const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
  </svg>
);

const BotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.15l-2.203 2.204a.414.414 0 01-.585 0l-2.203-2.204a.39.39 0 00-.297-.15 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
  </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);

const SendIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

interface ChatProps {
  chatHistory: ChatMessage[];
  onSendMessage: (message: string) => void;
  isResponding: boolean;
}

export const Chat: React.FC<ChatProps> = ({ chatHistory, onSendMessage, isResponding }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [chatHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isResponding) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-black/20 overflow-hidden">
      <div className="flex-grow p-4 md:p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6 h-full">
          {chatHistory.length === 0 && !isResponding ? (
             <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                <BotIcon className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Analysis Complete</h3>
                <p className="mt-1">Ask me anything about your document to get started.</p>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 ${msg.sender === MessageSender.USER ? 'justify-end' : ''}`}>
                {msg.sender === MessageSender.AI && (
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isError ? 'bg-red-500' : 'bg-indigo-500'}`}>
                    {msg.isError ? (
                      <ExclamationTriangleIcon className="w-5 h-5 text-white" />
                    ) : (
                      <BotIcon className="w-5 h-5 text-white" />
                    )}
                  </div>
                )}
                <div className={`p-3 rounded-xl max-w-lg ${
                  msg.sender === MessageSender.AI 
                    ? msg.isError
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-900 dark:text-red-100 rounded-bl-none'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
                    : 'bg-indigo-600 text-white rounded-br-none'}`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === MessageSender.USER && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}

          {isResponding && (
            <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0">
                  <BotIcon className="w-5 h-5 text-white" />
                </div>
                <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                    <SpinnerIcon className="w-5 h-5 text-indigo-500" />
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="p-4 md:p-6 border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the contract..."
              disabled={isResponding || chatHistory.some(m => m.isError)}
              className="w-full pl-4 pr-12 py-3 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-transparent focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!input.trim() || isResponding || chatHistory.some(m => m.isError)}
              aria-label="Send message"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
