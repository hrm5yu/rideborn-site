// Advanced Glitch Effects for Images
class GlitchEffect {
  constructor() {
    this.images = document.querySelectorAll('.card img, .rb-img');
    this.init();
  }

  init() {
    this.images.forEach(img => {
      this.addGlitchLayers(img);
      this.addRandomFlicker(img);
      this.addScanLines(img);
    });
  }

  addGlitchLayers(img) {
    const container = img.parentElement;
    
    // Create red channel layer
    const redLayer = document.createElement('div');
    redLayer.className = 'glitch-layer glitch-red';
    redLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${img.src});
      background-size: cover;
      background-position: center;
      opacity: 0;
      mix-blend-mode: screen;
      pointer-events: none;
      z-index: 1;
    `;
    
    // Create blue channel layer
    const blueLayer = document.createElement('div');
    blueLayer.className = 'glitch-layer glitch-blue';
    blueLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${img.src});
      background-size: cover;
      background-position: center;
      opacity: 0;
      mix-blend-mode: screen;
      pointer-events: none;
      z-index: 2;
    `;
    
    // Create green channel layer
    const greenLayer = document.createElement('div');
    greenLayer.className = 'glitch-layer glitch-green';
    greenLayer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url(${img.src});
      background-size: cover;
      background-position: center;
      opacity: 0;
      mix-blend-mode: screen;
      pointer-events: none;
      z-index: 3;
    `;
    
    container.style.position = 'relative';
    container.appendChild(redLayer);
    container.appendChild(blueLayer);
    container.appendChild(greenLayer);
    
    // Add hover effects
    container.addEventListener('mouseenter', () => {
      this.triggerGlitch(redLayer, blueLayer, greenLayer);
    });
    
    container.addEventListener('mouseleave', () => {
      this.stopGlitch(redLayer, blueLayer, greenLayer);
    });
  }

  triggerGlitch(redLayer, blueLayer, greenLayer) {
    // Random glitch intervals
    const glitchInterval = setInterval(() => {
      const duration = Math.random() * 200 + 50;
      const intensity = Math.random() * 0.5 + 0.1;
      
      redLayer.style.opacity = intensity;
      blueLayer.style.opacity = intensity;
      greenLayer.style.opacity = intensity;
      
      // Random position shifts
      redLayer.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
      blueLayer.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
      greenLayer.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
      
      setTimeout(() => {
        redLayer.style.opacity = 0;
        blueLayer.style.opacity = 0;
        greenLayer.style.opacity = 0;
        redLayer.style.transform = 'translate(0, 0)';
        blueLayer.style.transform = 'translate(0, 0)';
        greenLayer.style.transform = 'translate(0, 0)';
      }, duration);
    }, Math.random() * 1000 + 500);
    
    // Store interval for cleanup
    redLayer.glitchInterval = glitchInterval;
  }

  stopGlitch(redLayer, blueLayer, greenLayer) {
    if (redLayer.glitchInterval) {
      clearInterval(redLayer.glitchInterval);
    }
    redLayer.style.opacity = 0;
    blueLayer.style.opacity = 0;
    greenLayer.style.opacity = 0;
    redLayer.style.transform = 'translate(0, 0)';
    blueLayer.style.transform = 'translate(0, 0)';
    greenLayer.style.transform = 'translate(0, 0)';
  }

  addRandomFlicker(img) {
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance to flicker
        img.style.filter = 'brightness(0.8) contrast(1.2)';
        setTimeout(() => {
          img.style.filter = 'brightness(1) contrast(1)';
        }, Math.random() * 100 + 50);
      }
    }, Math.random() * 2000 + 1000);
    
    img.flickerInterval = flickerInterval;
  }

  addScanLines(img) {
    const container = img.parentElement;
    
    // Create scan line
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    scanLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00ff41, transparent);
      opacity: 0;
      pointer-events: none;
      z-index: 10;
    `;
    
    container.appendChild(scanLine);
    
    // Random scan line animation
    const scanInterval = setInterval(() => {
      if (Math.random() < 0.05) { // 5% chance to show scan line
        scanLine.style.opacity = 0.8;
        scanLine.style.animation = 'scan-line 0.5s linear';
        
        setTimeout(() => {
          scanLine.style.opacity = 0;
          scanLine.style.animation = 'none';
        }, 500);
      }
    }, Math.random() * 3000 + 2000);
    
    scanLine.scanInterval = scanInterval;
  }
}

// CRT Monitor Effect
class CRTEffect {
  constructor() {
    this.init();
  }

  init() {
    // Add CRT overlay
    const crtOverlay = document.createElement('div');
    crtOverlay.className = 'crt-overlay';
    crtOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: 
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 255, 65, 0.03) 2px,
          rgba(0, 255, 65, 0.03) 4px
        );
      animation: crt-flicker 0.1s infinite;
    `;
    
    document.body.appendChild(crtOverlay);
  }
}

// Noise Effect
class NoiseEffect {
  constructor() {
    this.init();
  }

  init() {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.className = 'noise-canvas';
    noiseCanvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
      opacity: 0.02;
      mix-blend-mode: overlay;
    `;
    
    document.body.appendChild(noiseCanvas);
    
    const ctx = noiseCanvas.getContext('2d');
    noiseCanvas.width = window.innerWidth;
    noiseCanvas.height = window.innerHeight;
    
    this.generateNoise(ctx, noiseCanvas.width, noiseCanvas.height);
    
    // Resize handler
    window.addEventListener('resize', () => {
      noiseCanvas.width = window.innerWidth;
      noiseCanvas.height = window.innerHeight;
      this.generateNoise(ctx, noiseCanvas.width, noiseCanvas.height);
    });
  }

  generateNoise(ctx, width, height) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255;
      data[i] = noise;     // Red
      data[i + 1] = noise; // Green
      data[i + 2] = noise; // Blue
      data[i + 3] = 255;   // Alpha
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GlitchEffect();
  new CRTEffect();
  new NoiseEffect();
});

// Add random glitch to page elements
setInterval(() => {
  const elements = document.querySelectorAll('h1, h2, h3, .logo-text');
  const randomElement = elements[Math.floor(Math.random() * elements.length)];
  
  if (randomElement && Math.random() < 0.1) { // 10% chance
    randomElement.style.animation = 'glitch 0.1s ease';
    setTimeout(() => {
      randomElement.style.animation = '';
    }, 100);
  }
}, 2000);
