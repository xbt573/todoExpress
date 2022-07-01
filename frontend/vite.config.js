import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import vite_mpa from 'vite-plugin-mpa';
const mpa = vite_mpa.default;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), mpa()]
})
