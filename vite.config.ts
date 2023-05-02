import { sveltekit } from '@sveltejs/kit/vite';
import FullReload from 'vite-plugin-full-reload';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), FullReload(['src/blog/**/*.md'])],

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "src/variables.scss" as *;',
      },
    },
  },
});
