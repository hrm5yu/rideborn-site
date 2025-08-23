import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://あなたのユーザー名.github.io',
  base: '/rideborn-site',
  output: 'static', // 静的サイトとして出力
  build: {
    assets: 'assets'
  }
});
