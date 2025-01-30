import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/rajshreeenterprises/',
  server: {
    historyApiFallback: {
      rewrites: [
        { 
          from: /^\/rajshreeenterprises\/.*/, 
          to: '/rajshreeenterprises/index.html' 
        }
      ]
    }
  }
})
