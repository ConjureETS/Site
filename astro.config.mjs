import { defineConfig } from 'astro/config';
import sass from 'sass';

export default defineConfig({
  integrations: [],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          implementation: sass,
        },
      },
    },
  },
});
