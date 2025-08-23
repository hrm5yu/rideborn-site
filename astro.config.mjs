import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://rideborn.jp',
  output: 'static', // 静的サイトとして出力
  build: {
    assets: 'assets'
  }
});
