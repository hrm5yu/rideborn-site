# Astro + microCMS Starter

黒背景×生成り文字のミニマルUI（横ストリップ＋カードグリッド）を、Astro + microCMS で静的生成します。

## セットアップ
1. 依存インストール: `npm i`
2. `.env` を作成して以下を設定（`.env.example` をコピー）
   - `PUBLIC_MICROCMS_SERVICE_DOMAIN`（サービスID）
   - `MICROCMS_API_KEY`（読み取りキー）
3. microCMS で `posts` コンテンツを作成し、以下のフィールドを用意
   - `title` (text)
   - `slug` (text, unique)
   - `date` (date)
   - `thumbnail` (image)
   - `excerpt` (text, optional)
   - `body` (rich editor) ※HTML出力を想定
4. 開発: `npm run dev`
5. ビルド: `npm run build` → `dist/` をデプロイ（Netlify/Vercel/Pages）

## ルーティング
- `/` : 最新記事のストリップ（10件）＋グリッド（12件）
- `/posts/[slug]` : 記事詳細（SSG）

## 注意
- APIキーは公開しないでください（クライアントでは使いません）。
- 画像や本文仕様を変えたら `src/lib/types.ts` を調整してください。
