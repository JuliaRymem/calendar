import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'   // <-- lägg till

export default defineConfig({
  plugins: [react(), tailwindcss()],          // <-- aktivera
})