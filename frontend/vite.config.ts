import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        // If you add another file path, also update in tsconfig.app.json
        '@': path.resolve(__dirname, './src'),
        '@features': path.resolve(__dirname, './src/features'),
        '@services': path.resolve(__dirname, './src/services'),
        '@shared': path.resolve(__dirname, './src/shared'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },

    test: {
      globals: true,
      environment: 'jsdom',
    },
  };
});
