import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://hrm5yu.github.io',
  base: '/rideborn-site',
  output: 'static', // 静的サイトとして出力
  build: {
    assets: 'assets'
  }
});
