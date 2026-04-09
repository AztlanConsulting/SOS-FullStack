import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // If you add another file path, also update in tsconfig.app.json
      '@': __dirname,
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
});
