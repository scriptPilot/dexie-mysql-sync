import react from '@vitejs/plugin-react'

export default {
  server: {
    proxy: {
      '^(.+)\\.php': 'http://localhost:8000/',
    },
  },
  plugins: [
    react(),
  ],
}