import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
  if (mode === 'development'){
    return {
      plugins: [vue()],
      build: {
        outDir: '../'
      }
    }
  } else return {
    plugins: [vue()],
    build: {
      outDir: '../'
    },
    publicDir: './geomoose'
  }
})
