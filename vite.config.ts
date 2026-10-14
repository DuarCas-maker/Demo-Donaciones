import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ plugins: [react(), tailwindcss()], build:{rollupOptions:{output:{manualChunks(id){if(id.includes('node_modules/jspdf')||id.includes('node_modules/fflate')||id.includes('node_modules/fast-png'))return 'documentos';if(id.includes('node_modules/react-dom')||id.includes('node_modules/react-router')||id.includes('node_modules/react/'))return 'react';}}}} });
