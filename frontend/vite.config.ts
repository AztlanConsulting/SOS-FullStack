import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BASE_URL,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        // If you add another file path, also update in tsconfig.app.json
        '@': __dirname,
        '@utils': path.resolve(__dirname, 'src/utils'),
      },
    },
  };
});
