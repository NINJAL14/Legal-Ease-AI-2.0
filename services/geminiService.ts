import { GoogleGenAI, Type } from "@google/genai";
import * as pdfjsLib from 'pdfjs-dist';
import type { ChatMessage, LanguageCode } from '../types';
import { supportedLanguages } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A concise, easy-to-understand summary of the entire contract, written in plain language.",
    },
    keyClauses: {
      type: Type.ARRAY,
      description: "A list of the most important clauses.",
      items: {
        type: Type.OBJECT,
        properties: {
          clause: { type: Type.STRING, description: "The clause title or a short quote from the contract." },
          explanation: { type: Type.STRING, description: "A simple explanation of what the clause means." },
          citation: { type: Type.STRING, description: "The section or clause number from the contract (e.g., 'Section 3.1')." },
        },
        required: ["clause", "explanation", "citation"],
      },
    },
    riskFlags: {
      type: Type.ARRAY,
      description: "A list of potential risks or clauses that the user should pay close attention to (e.g., termination, liability, penalties).",
      items: {
        type: Type.OBJECT,
        properties: {
          risk: { type: Type.STRING, description: "A short title for the identified risk." },
          explanation: { type: Type.STRING, description: "An explanation of why this clause is a potential risk." },
          citation: { type: Type.STRING, description: "The section or clause number where the risk is found." },
        },
        required: ["risk", "explanation", "citation"],
      },
    },
  },
  required: ["summary", "keyClauses", "riskFlags"],
};

/**
 * Performs OCR on a PDF file by converting its pages to images and sending them to Gemini.
 * @param file The PDF file object.
 * @returns A promise that resolves to the OCR-extracted text content.
 */
export const ocrPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, disableFontFace: true });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const imageParts = [];
  // Use a higher scale for better OCR quality on high-resolution screens.
  const RENDER_SCALE = 2.0;

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: RENDER_SCALE });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    if (!context) {
      throw new Error("Could not create canvas context for OCR.");
    }

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    await page.render(renderContext).promise;
    
    // Convert canvas to a base64 JPEG string. JPEG is generally smaller.
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const base64Data = dataUrl.split(',')[1];

    imageParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64Data,
      },
    });
  }

  if (imageParts.length === 0) {
    return "";
  }

  const prompt = `
    You are an Optical Character Recognition (OCR) service.
    Extract all text from the following document pages, in the order they are provided.
    Preserve the original formatting, including line breaks and paragraphs, as accurately as possible.
    Return only the extracted text. Do not add any commentary, summaries, or explanations.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [{ text: prompt }, ...imageParts] },
    });
    return response.text;
  } catch (error) {
    console.error("Error performing OCR:", error);
    throw new Error("Failed to perform OCR on the document. The AI service may be unavailable or the document is unreadable.");
  }
};

export const analyzeContract = async (contractText: string, language: LanguageCode) => {
  const languageName = supportedLanguages[language];
  const prompt = `
You are an expert AI legal assistant named Legal Ease AI. Your goal is to help users understand complex legal documents.
Analyze the following contract text carefully. Provide your analysis in ${languageName}.
The output must be a valid JSON object matching the provided schema.

Contract Text:
---
${contractText}
---
`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error analyzing contract:", error);
    throw new Error("Failed to analyze the contract. The document may be too complex or there was an issue with the AI service.");
  }
};

export const answerQuestion = async (
  contractText: string,
  chatHistory: ChatMessage[],
  question: string,
  language: LanguageCode
) => {
  const languageName = supportedLanguages[language];
  const historyString = chatHistory
    .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}`)
    .join('\n');

  const prompt = `
You are Legal Ease AI, a helpful legal assistant. You are having a conversation with a user about a specific contract.
Use the provided Contract Text and the Chat History to answer the user's latest question.
Your answers should be in ${languageName}, clear, concise, and directly reference the contract text.
When you reference a part of the contract, provide a citation in parentheses, like (Section 4.2). Do not make up information. Base all answers on the provided contract.

**Contract Text:**
---
${contractText}
---

**Chat History:**
${historyString}

**User's Question:**
${question}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error answering question:", error);
    throw new Error("Failed to get an answer. Please try asking in a different way.");
  }
};
