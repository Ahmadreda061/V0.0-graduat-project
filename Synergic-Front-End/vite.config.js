import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compressionPlugin from 'vite-plugin-compression'; // Import the compression plugin

export default defineConfig({
  plugins: [
    react(), // Include the React plugin
    compressionPlugin(), // Include the compression plugin
  ],
});
