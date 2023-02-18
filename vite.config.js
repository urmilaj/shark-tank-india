import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dsv from '@rollup/plugin-dsv'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/shark-tank-india/',
  plugins: [vue(),dsv(),],
})
