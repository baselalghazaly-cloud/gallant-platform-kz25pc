import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // This plugin enables React support, JSX compilation, and Fast Refresh
  plugins: [react()],
});
