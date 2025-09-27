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

        // FIX 1: CRITICAL RESOLUTION ALIAS
        // This maps the bare 'pdfjs-dist' import in App.tsx to the specific CJS build file, 
        // which forces Rollup to find the main library entry point.
        'pdfjs-dist': 'pdfjs-dist/build/pdf.js',
        
        // FIX 2: WORKER ALIAS
        // This handles the specific mismatch where Vite/Rollup tries to load the .mjs 
        // worker but needs to be directed to the existing .js file.
        'pdfjs-dist/build/pdf.worker.min.mjs': 'pdfjs-dist/build/pdf.worker.min.js',
      },
    },
    // FIX 3: ASSET HANDLING (Optional but highly recommended for the worker file)
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
    // NOTE: We are intentionally excluding 'optimizeDeps' and 'external' from here, 
    // as they conflicted with other necessary fixes.
  };
});
