import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://your-domain.com', // お名前.comのドメインに変更
  output: 'static', // 静的サイトとして出力
  build: {
    assets: 'assets'
  }
});
