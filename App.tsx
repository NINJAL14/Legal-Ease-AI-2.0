import React, { useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { FileUpload } from './components/FileUpload';
import { Chat } from './components/Chat';
import { Disclaimer } from './components/Disclaimer';
import type { AnalysisResult, ChatMessage, LanguageCode } from './types';
import { MessageSender } from './types';
import { analyzeContract, answerQuestion, ocrPdf } from './services/geminiService';

// Configure the PDF.js worker to enable text extraction
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs`;

/**
 * Extracts text content from a PDF file using standard methods.
 * @param file The PDF file object.
 * @returns A promise that resolves to the text content of the PDF.
 */
const extractTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Setting `disableFontFace` to true can improve performance and avoid font loading issues.
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, disableFontFace: true });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
    fullText += pageText + '\n\n';
  }
  
  return fullText;
};


export const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [contractText, setContractText] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    setChatHistory([]);
    setContractText(null);

    try {
      // Step 1: Attempt standard text extraction.
      let extractedText = await extractTextFromPdf(uploadedFile);

      // Step 2: If standard extraction yields little or no text (e.g., <100 chars), fall back to OCR.
      if (!extractedText || extractedText.trim().length < 100) {
        console.log("Standard text extraction insufficient. Falling back to OCR.");
        const ocrText = await ocrPdf(uploadedFile);
        
        if (!ocrText || ocrText.trim().length === 0) {
          throw new Error("Could not extract any text from the PDF, even with OCR. The document might be empty, corrupted, or contain unreadable text.");
        }
        extractedText = ocrText;
      }
      
      setContractText(extractedText);

      const result = await analyzeContract(extractedText, selectedLanguage);
      setAnalysisResult(result);
    } catch (e) {
      const err = e as Error;
      let errorMessage = err.message || 'An unknown error occurred.';
      
      if (err.name === 'InvalidPDFException' || err.message.includes('PDF')) {
          errorMessage = 'Failed to process the document. Please ensure it is a valid, uncorrupted PDF file.';
      } else if (err.message.includes('Failed to analyze') || err.message.includes('OCR')) {
          errorMessage = err.message;
      }

      setChatHistory([
        {
          id: crypto.randomUUID(),
          sender: MessageSender.AI,
          text: errorMessage,
          isError: true,
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedLanguage]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!contractText) return;

    const newUserMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: MessageSender.USER,
      text: message,
    };
    const updatedHistory = [...chatHistory, newUserMessage];
    setChatHistory(updatedHistory);
    setIsResponding(true);

    try {
      const responseText = await answerQuestion(contractText, updatedHistory, message, selectedLanguage);
      const aiResponse: ChatMessage = {
        id: crypto.randomUUID(),
        sender: MessageSender.AI,
        text: responseText,
      };
      setChatHistory(prev => [...prev, aiResponse]);
    } catch (e) {
      const err = e as Error;
      const errorResponse: ChatMessage = {
        id: crypto.randomUUID(),
        sender: MessageSender.AI,
        text: err.message,
        isError: true,
      };
      setChatHistory(prev => [...prev, errorResponse]);
    } finally {
      setIsResponding(false);
    }
  }, [contractText, chatHistory, selectedLanguage]);
  
  const handleLanguageChange = useCallback((lang: LanguageCode) => {
    setSelectedLanguage(lang);

    if (contractText) {
      const reAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setChatHistory([]);
        try {
          const result = await analyzeContract(contractText, lang);
          setAnalysisResult(result);
        } catch (e) {
          const err = e as Error;
          const errorMessage = err.message || 'An unknown error occurred while re-analyzing the document in the new language.';
          setChatHistory([
            {
              id: crypto.randomUUID(),
              sender: MessageSender.AI,
              text: errorMessage,
              isError: true,
            },
          ]);
        } finally {
          setIsAnalyzing(false);
        }
      };
      reAnalyze();
    }
  }, [contractText]);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header 
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
        isAnalyzing={isAnalyzing}
      />
      <main className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <Sidebar 
          analysisResult={analysisResult}
          isAnalyzing={isAnalyzing}
          fileName={file?.name || null}
        />
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">
          {!file || isAnalyzing ? (
            <FileUpload onFileUpload={handleFileUpload} isAnalyzing={isAnalyzing} />
          ) : (
            <Chat 
              chatHistory={chatHistory} 
              onSendMessage={handleSendMessage} 
              isResponding={isResponding}
            />
          )}
        </div>
      </main>
      <Disclaimer />
    </div>
  );
};

export default App;
