#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// インタラクティブなCLIツール
class ImageOptimizerGUI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  /**
   * 質問を表示して回答を取得
   */
  async question(prompt) {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  /**
   * メインメニューを表示
   */
  async showMainMenu() {
    console.clear();
    console.log('🎨 画像最適化ツール');
    console.log('─'.repeat(40));
    console.log('1. 単一画像を最適化');
    console.log('2. フォルダ内の画像を一括最適化');
    console.log('3. 複数サイズで一括最適化');
    console.log('4. 最適化設定を確認');
    console.log('5. 終了');
    console.log('─'.repeat(40));
    
    const choice = await this.question('選択してください (1-5): ');
    return choice.trim();
  }

  /**
   * 単一画像最適化
   */
  async optimizeSingleImage() {
    console.log('\n📁 単一画像最適化');
    console.log('─'.repeat(30));
    
    const inputPath = await this.question('画像ファイルのパスを入力してください: ');
    const outputPath = await this.question('出力ファイルのパスを入力してください (Enterで自動生成): ');
    
    const width = parseInt(await this.question('幅 (px): ')) || 600;
    const height = parseInt(await this.question('高さ (px): ')) || 400;
    const quality = parseInt(await this.question('品質 (1-100): ')) || 80;
    
    try {
      const finalOutputPath = outputPath || inputPath.replace(/\.[^/.]+$/, '_optimized.webp');
      
      console.log('\n🔄 最適化中...');
      
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;
      
             await sharp(inputPath)
         .resize(width, height, {
           fit: 'inside',
           withoutEnlargement: true
         })
         .webp({ quality })
         .toFile(finalOutputPath);
      
      const optimizedStats = fs.statSync(finalOutputPath);
      const optimizedSize = optimizedStats.size;
      const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log('✅ 最適化完了！');
      console.log(`📊 サイズ削減: ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${reduction}%削減)`);
      
    } catch (error) {
      console.error('❌ エラー:', error.message);
    }
    
    await this.question('\nEnterキーを押して続行...');
  }

  /**
   * フォルダ一括最適化
   */
  async batchOptimize() {
    console.log('\n📁 フォルダ一括最適化');
    console.log('─'.repeat(30));
    
    const inputDir = await this.question('入力フォルダのパス: ');
    const outputDir = await this.question('出力フォルダのパス (Enterで自動生成): ');
    
    const width = parseInt(await this.question('幅 (px): ')) || 600;
    const height = parseInt(await this.question('高さ (px): ')) || 400;
    const quality = parseInt(await this.question('品質 (1-100): ')) || 80;
    
    const finalOutputDir = outputDir || path.join(path.dirname(inputDir), 'optimized');
    
    try {
      if (!fs.existsSync(inputDir)) {
        throw new Error('入力フォルダが存在しません');
      }
      
      if (!fs.existsSync(finalOutputDir)) {
        fs.mkdirSync(finalOutputDir, { recursive: true });
      }
      
      const files = fs.readdirSync(inputDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|gif|bmp|tiff|webp)$/i.test(file)
      );
      
      if (imageFiles.length === 0) {
        console.log('📁 処理対象の画像ファイルが見つかりません');
        return;
      }
      
      console.log(`\n🔄 ${imageFiles.length}個の画像を最適化中...`);
      
      let totalOriginalSize = 0;
      let totalOptimizedSize = 0;
      
      for (const file of imageFiles) {
        const inputPath = path.join(inputDir, file);
        const outputFileName = path.parse(file).name + '.webp';
        const outputPath = path.join(finalOutputDir, outputFileName);
        
        const stats = fs.statSync(inputPath);
        totalOriginalSize += stats.size;
        
                 await sharp(inputPath)
           .resize(width, height, {
             fit: 'inside',
             withoutEnlargement: true
           })
           .webp({ quality })
           .toFile(outputPath);
        
        const optimizedStats = fs.statSync(outputPath);
        totalOptimizedSize += optimizedStats.size;
        
        console.log(`✅ ${file} → ${outputFileName}`);
      }
      
      const reduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
      console.log('\n🎉 一括最適化完了！');
      console.log(`📊 総サイズ削減: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB (${reduction}%削減)`);
      
    } catch (error) {
      console.error('❌ エラー:', error.message);
    }
    
    await this.question('\nEnterキーを押して続行...');
  }

  /**
   * 複数サイズ一括最適化
   */
  async multiSizeOptimize() {
    console.log('\n📁 複数サイズ一括最適化');
    console.log('─'.repeat(30));
    
    const inputDir = await this.question('入力フォルダのパス: ');
    const outputDir = await this.question('出力フォルダのパス (Enterで自動生成): ');
    
    const finalOutputDir = outputDir || path.join(path.dirname(inputDir), 'multi-size');
    
    // プリセット設定
    const presets = {
      card: { width: 600, height: 400, quality: 80, suffix: '_card' },
      article: { width: 800, height: 500, quality: 80, suffix: '_article' },
      hero: { width: 1200, height: 600, quality: 85, suffix: '_hero' },
      thumbnail: { width: 400, height: 400, quality: 75, suffix: '_thumb' }
    };
    
    console.log('\n📋 プリセット設定:');
    Object.entries(presets).forEach(([name, config]) => {
      console.log(`   ${name}: ${config.width}x${config.height}px, ${config.quality}%品質`);
    });
    
    const usePresets = await this.question('\nプリセット設定を使用しますか？ (y/n): ');
    
    if (usePresets.toLowerCase() === 'y') {
      try {
        const { batchOptimize } = require('./batch-optimize');
        await batchOptimize(inputDir, finalOutputDir);
        console.log('✅ プリセット最適化完了！');
      } catch (error) {
        console.error('❌ エラー:', error.message);
      }
    } else {
      console.log('カスタム設定は手動で行ってください');
    }
    
    await this.question('\nEnterキーを押して続行...');
  }

  /**
   * 設定確認
   */
  async showSettings() {
    console.log('\n⚙️  最適化設定');
    console.log('─'.repeat(30));
    
    const { IMAGE_SIZES } = require('../src/lib/image-utils');
    
    console.log('📋 現在の設定:');
    Object.entries(IMAGE_SIZES).forEach(([name, config]) => {
      console.log(`   ${name}: ${config.width}x${config.height}px, ${config.quality}%品質, ${config.format}形式`);
    });
    
    console.log('\n📋 プリセット設定:');
    const presets = {
      card: { width: 600, height: 400, quality: 80 },
      article: { width: 800, height: 500, quality: 80 },
      hero: { width: 1200, height: 600, quality: 85 },
      thumbnail: { width: 400, height: 400, quality: 75 }
    };
    
    Object.entries(presets).forEach(([name, config]) => {
      console.log(`   ${name}: ${config.width}x${config.height}px, ${config.quality}%品質`);
    });
    
    await this.question('\nEnterキーを押して続行...');
  }

  /**
   * メインループ
   */
  async run() {
    while (true) {
      const choice = await this.showMainMenu();
      
      switch (choice) {
        case '1':
          await this.optimizeSingleImage();
          break;
        case '2':
          await this.batchOptimize();
          break;
        case '3':
          await this.multiSizeOptimize();
          break;
        case '4':
          await this.showSettings();
          break;
        case '5':
          console.log('👋 終了します');
          this.rl.close();
          return;
        default:
          console.log('❌ 無効な選択です');
          await this.question('\nEnterキーを押して続行...');
      }
    }
  }
}

// スクリプト実行
if (require.main === module) {
  const gui = new ImageOptimizerGUI();
  gui.run().catch(console.error);
}

module.exports = ImageOptimizerGUI;
