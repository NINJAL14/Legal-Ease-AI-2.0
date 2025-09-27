import React, { useCallback, useState } from 'react';

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l-3.75 3.75M12 9.75l3.75 3.75M3 17.25V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.25z" />
  </svg>
);

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, isAnalyzing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  }, [onFileUpload]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-black/20">
        <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Upload Your Contract</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
                Get an instant analysis of your legal document. Simply upload a PDF to get started.
            </p>
            <label
                htmlFor="file-upload"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`relative block w-full rounded-lg border-2 border-dashed ${isDragging ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10' : 'border-gray-300 dark:border-gray-600'} p-12 text-center hover:border-indigo-500 dark:hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-colors duration-200`}
            >
                <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-gray-200">
                    {isDragging ? 'Drop the file here...' : 'Drag and drop a PDF file'}
                </span>
                <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">or click to browse</span>
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf"
                    onChange={handleFileChange}
                    disabled={isAnalyzing}
                />
            </label>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">PDF files up to 10MB are supported.</p>
        </div>
    </div>
  );
};