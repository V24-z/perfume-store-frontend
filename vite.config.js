import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import tailwindcss from '@tailwindcss/vite'; // v3 compatible
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})