#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 画像最適化設定
const OPTIMIZATION_CONFIG = {
  card: {
    width: 600,
    height: 400,
    quality: 80,
    format: 'webp'
  },
  article: {
    width: 800,
    height: 500,
    quality: 85,
    format: 'webp'
  },
  hero: {
    width: 1200,
    height: 600,
    quality: 90,
    format: 'webp'
  },
  thumbnail: {
    width: 400,
    height: 400,
    quality: 80,
    format: 'webp'
  }
};

/**
 * 画像を最適化する
 */
async function optimizeImage(inputPath, outputPath, config) {
  try {
    await sharp(inputPath)
      .resize(config.width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: config.quality })
      .toFile(outputPath);
    
    console.log(`✅ 最適化完了: ${path.basename(inputPath)}`);
  } catch (error) {
    console.error(`❌ エラー: ${path.basename(inputPath)}`, error.message);
  }
}

/**
 * ディレクトリ内の画像を一括最適化
 */
async function optimizeDirectory(inputDir, outputDir, config) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file)
  );

  console.log(`📁 処理対象: ${imageFiles.length}個の画像ファイル`);

  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const outputFileName = path.parse(file).name + '.webp';
    const outputPath = path.join(outputDir, outputFileName);
    
    await optimizeImage(inputPath, outputPath, config);
  }
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const type = args[0] || 'card';
  const inputDir = args[1] || './images/original';
  const outputDir = args[2] || `./images/optimized/${type}`;

  if (!OPTIMIZATION_CONFIG[type]) {
    console.error('❌ 無効なタイプです。使用可能: card, article, hero, thumbnail');
    process.exit(1);
  }

  const config = OPTIMIZATION_CONFIG[type];
  
  console.log(`🚀 画像最適化開始: ${type}`);
  console.log(`📂 入力: ${inputDir}`);
  console.log(`📂 出力: ${outputDir}`);
  console.log(`⚙️  設定: ${config.width}x${config.height}, ${config.quality}%品質, ${config.format}形式`);

  await optimizeDirectory(inputDir, outputDir, config);
  
  console.log('🎉 最適化完了！');
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { optimizeImage, optimizeDirectory };
