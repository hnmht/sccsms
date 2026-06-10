import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:6003,
    proxy:{
      "/api":{
        target:"http://101.201.238.172:10033",
        changeOrigin:true,
      }
    }
  }
})
