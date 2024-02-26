import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // eslint-disable-next-line no-useless-escape
      '^(.+)\\.php': 'http://localhost:8000/',
    },
  },
  plugins: [react()],
})
