#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// バッチ最適化設定（アスペクト比保持）
const BATCH_CONFIG = {
  // カード画像用
  card: {
    width: 600,
    quality: 80,
    format: 'webp',
    suffix: '_card'
  },
  // 記事画像用
  article: {
    width: 800,
    quality: 80,
    format: 'webp',
    suffix: '_article'
  },
  // ヒーロー画像用
  hero: {
    width: 1200,
    quality: 85,
    format: 'webp',
    suffix: '_hero'
  },
  // サムネイル用
  thumbnail: {
    width: 400,
    quality: 75,
    format: 'webp',
    suffix: '_thumb'
  }
};

/**
 * 単一画像を最適化
 */
async function optimizeSingleImage(inputPath, outputPath, config) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;
    
    await sharp(inputPath)
      .resize(config.width, null, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: config.quality })
      .toFile(outputPath);
    
    const optimizedStats = fs.statSync(outputPath);
    const optimizedSize = optimizedStats.size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
    console.log(`   📊 サイズ削減: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${reduction}%削減)`);
    
    return { success: true, originalSize, optimizedSize, reduction };
  } catch (error) {
    console.error(`❌ エラー: ${path.basename(inputPath)}`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * 複数サイズで画像を最適化
 */
async function optimizeMultipleSizes(inputPath, outputDir, configs) {
  const results = [];
  
  for (const [type, config] of Object.entries(configs)) {
    const outputFileName = path.parse(path.basename(inputPath)).name + config.suffix + '.webp';
    const outputPath = path.join(outputDir, type, outputFileName);
    
    // 出力ディレクトリを作成
    const typeDir = path.join(outputDir, type);
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }
    
    const result = await optimizeSingleImage(inputPath, outputPath, config);
    results.push({ type, ...result });
  }
  
  return results;
}

/**
 * ディレクトリ内の画像を一括最適化
 */
async function batchOptimize(inputDir, outputDir, configs = BATCH_CONFIG) {
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ 入力ディレクトリが存在しません: ${inputDir}`);
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file)
  );
  
  if (imageFiles.length === 0) {
    console.log('📁 処理対象の画像ファイルが見つかりません');
    return;
  }
  
  console.log(`🚀 バッチ画像最適化開始`);
  console.log(`📂 入力: ${inputDir}`);
  console.log(`📂 出力: ${outputDir}`);
  console.log(`📁 処理対象: ${imageFiles.length}個の画像ファイル`);
  console.log(`⚙️  最適化タイプ: ${Object.keys(configs).join(', ')}`);
  console.log('─'.repeat(50));
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let successCount = 0;
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    console.log(`\n🔄 処理中: ${file}`);
    
    const results = await optimizeMultipleSizes(inputPath, outputDir, configs);
    
    for (const result of results) {
      if (result.success) {
        totalOriginalSize += result.originalSize;
        totalOptimizedSize += result.optimizedSize;
        successCount++;
      }
    }
  }
  
  console.log('\n' + '─'.repeat(50));
  console.log('🎉 バッチ最適化完了！');
  console.log(`📊 総合結果:`);
  console.log(`   ✅ 成功: ${successCount}個のファイル`);
  console.log(`   📦 総サイズ削減: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   💾 削減率: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
}

/**
 * メイン処理
 */
async function main() {
  const args = process.argv.slice(2);
  const inputDir = args[0] || './images/original';
  const outputDir = args[1] || './images/optimized';
  
  // 特定のタイプのみ最適化する場合
  const type = args[2];
  const configs = type && BATCH_CONFIG[type] 
    ? { [type]: BATCH_CONFIG[type] }
    : BATCH_CONFIG;
  
  await batchOptimize(inputDir, outputDir, configs);
}

// スクリプト実行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { batchOptimize, optimizeMultipleSizes };
