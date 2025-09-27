import React, { useState, useEffect, useRef } from 'react';

// CRITICAL FIX: Revert to bare package name. The package is now externalized in vite.config.ts.
import * as pdfjsLib from 'pdfjs-dist'; 
// The worker import remains specific and uses the ?url convention for Vite asset handling
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// 1. Configure PDF.js worker location
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Basic styling using assumed Tailwind CSS classes
const containerClasses = "min-h-screen bg-gray-50 flex flex-col items-center p-4 font-inter";
const headerClasses = "text-3xl font-bold text-indigo-700 mb-6";
const cardClasses = "bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl space-y-4";
const buttonClasses = "w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-150";

// Example PDF URL (using a standard Mozilla test PDF)
const DEFAULT_PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edea8e7b301c107e33555541e2e28c46440f3/examples/learning/helloworld.pdf';

const App: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<string>("Ready to load PDF.");

    // Function to render a specific page of the PDF
    const renderPage = async (pageNumber: number, pdfDocument: pdfjsLib.PDFDocumentProxy) => {
        try {
            const page = await pdfDocument.getPage(pageNumber);
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            const canvas = canvasRef.current;
            
            if (!canvas) return;

            const canvasContext = canvas.getContext('2d');
            if (!canvasContext) return;

            // Set canvas dimensions
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext: pdfjsLib.RenderParameters = {
                canvasContext,
                viewport
            };

            await page.render(renderContext).promise;
            setStatus(`PDF loaded successfully. Displaying Page ${pageNumber}`);
        } catch (error) {
            console.error("Error rendering page:", error);
            setStatus("Error rendering page.");
        }
    };

    // Main function to load the PDF document
    const loadPDF = async (url: string) => {
        setStatus("Loading PDF document...");
        try {
            const loadingTask = pdfjsLib.getDocument({ url });
            const pdfDocument = await loadingTask.promise;
            
            // For this simple example, we only render the first page
            await renderPage(1, pdfDocument);

        } catch (error) {
            console.error("Error loading PDF document:", error);
            setStatus(`Error loading PDF: ${(error as Error).message}`);
        }
    };

    return (
        <div className={containerClasses}>
            <h1 className={headerClasses}>Legal-Ease AI Document Viewer</h1>
            
            <div className={cardClasses}>
                <p className="text-gray-600">Status: <span className="font-medium text-gray-800">{status}</span></p>
                <button 
                    className={buttonClasses} 
                    onClick={() => loadPDF(DEFAULT_PDF_URL)}
                >
                    Load Sample PDF (Page 1)
                </button>
            </div>

            <div className="mt-8 shadow-2xl border-4 border-gray-200 rounded-lg overflow-hidden">
                {/* The Canvas element where the PDF will be rendered */}
                <canvas ref={canvasRef} className="block"></canvas>
            </div>
            
            <p className="mt-4 text-xs text-gray-400">
                This simple viewer uses pdfjs-dist and React.
            </p>
        </div>
    );
};

export default App;
