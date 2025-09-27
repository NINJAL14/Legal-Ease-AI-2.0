import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Ensure these environment variables are accessible in the code
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        // Your existing path alias
        '@': path.resolve(__dirname, '.'),
        
        // REMOVED: The root 'pdfjs-dist' alias, as it was corrupting the worker path.
        // The App.tsx file already explicitly imports the necessary files, 
        // so this alias is redundant and harmful.
        
        // Existing FIX: Alias the .mjs worker path to the correct .js file during resolve
        'pdfjs-dist/build/pdf.worker.min.mjs': 'pdfjs-dist/build/pdf.worker.min.js',
      },
    },
    // FIX for pdfjs-dist: Add rollup configuration to explicitly handle the worker asset
    build: {
      rollupOptions: {
        output: {
          // Instruct Rollup on how to name and handle assets, particularly the PDF worker.
          assetFileNames: (assetInfo) => {
            // Check if the asset is the PDF worker (might be referenced by its full path or just the name)
            if (assetInfo.name && assetInfo.name.includes('pdf.worker.min.mjs')) {
              return 'assets/pdf.worker.min.js';
            }
            return 'assets/[name]-[hash][extname]';
          },
        },
      },
    },
  };
});
