// Advanced 80s Cyber/Glitch Effects using multiple libraries
// Using CDN versions to avoid ES6 module issues

class AdvancedEffects {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = [];
    this.init();
  }

  init() {
    this.setupParticleSystem();
    this.setupTextEffects();
    this.setupColorPalette();
    this.setupGlitchMatrix();
  }

  // Particle system for background effects
  setupParticleSystem() {
    if (typeof THREE === 'undefined') {
      console.log('Three.js not loaded, skipping particle system');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.3';
    document.body.appendChild(canvas);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    for (let i = 0; i < 1000; i++) {
      positions.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
      );

      // 80s cyber colors
      const cyberColors = ['#00ff41', '#ff00ff', '#00ffff', '#ff0080', '#8000ff'];
      const color = cyberColors[Math.floor(Math.random() * cyberColors.length)];
      const threeColor = new THREE.Color(color);
      colors.push(threeColor.r, threeColor.g, threeColor.b);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);

    this.camera.position.z = 500;

    this.animateParticles();
  }

  animateParticles() {
    if (!this.particles) return;
    
    requestAnimationFrame(() => this.animateParticles());

    this.particles.rotation.x += 0.001;
    this.particles.rotation.y += 0.002;

    this.renderer.render(this.scene, this.camera);
  }

  // Advanced text effects using anime.js
  setupTextEffects() {
    // Glitch text effect
    const glitchTexts = document.querySelectorAll('h1, h2, .logo-text');
    
    glitchTexts.forEach(text => {
      this.createGlitchText(text);
    });

    // Typing effect for hero text
    const heroText = document.querySelector('.hero h1');
    if (heroText && typeof anime !== 'undefined') {
      this.createTypingEffect(heroText);
    }
  }

  createGlitchText(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    setInterval(() => {
      if (Math.random() < 0.1) {
        const glitchedText = originalText.split('').map(char => 
          Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('');

        element.textContent = glitchedText;
        
        setTimeout(() => {
          element.textContent = originalText;
        }, 100);
      }
    }, 2000);
  }

  createTypingEffect(element) {
    const text = element.textContent;
    element.textContent = '';
    
    anime({
      targets: element,
      innerHTML: [0, text],
      easing: 'easeInOutQuad',
      duration: 2000,
      round: 1
    });
  }

  // Dynamic color palette
  setupColorPalette() {
    const cyberColors = [
      '#00ff41', // Matrix green
      '#ff00ff', // Magenta
      '#00ffff', // Cyan
      '#ff0080', // Hot pink
      '#8000ff', // Purple
      '#00ff80', // Lime green
    ];

    // Create color cycling effect
    setInterval(() => {
      const randomColor = cyberColors[Math.floor(Math.random() * cyberColors.length)];
      const darkerColor = this.darkenColor(randomColor, 0.3);
      
      document.documentElement.style.setProperty('--cyber-primary', randomColor);
      document.documentElement.style.setProperty('--cyber-secondary', darkerColor);
    }, 5000);
  }

  // Simple color darkening function
  darkenColor(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * amount * 100);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  // Matrix-style glitch effect
  setupGlitchMatrix() {
    const canvas = document.createElement('canvas');
    canvas.id = 'matrix-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-2';
    canvas.style.opacity = '0.1';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");

    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff41';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    setInterval(draw, 35);
  }

  // Audio reactive effects (if audio is available)
  setupAudioReactive() {
    if (typeof AudioContext !== 'undefined') {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      
      // This would connect to actual audio input
      // For now, we'll create a simulated frequency response
      const frequencies = new Uint8Array(analyser.frequencyBinCount);
      
      setInterval(() => {
        // Simulate audio data
        for (let i = 0; i < frequencies.length; i++) {
          frequencies[i] = Math.random() * 255;
        }
        
        this.applyAudioReactiveEffects(frequencies);
      }, 100);
    }
  }

  applyAudioReactiveEffects(frequencies) {
    const average = frequencies.reduce((a, b) => a + b) / frequencies.length;
    const intensity = average / 255;
    
    // Apply effects based on audio intensity
    document.documentElement.style.setProperty('--audio-intensity', intensity);
  }

  // Screen distortion effect
  createScreenDistortion() {
    const overlay = document.createElement('div');
    overlay.className = 'screen-distortion';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1000;
      background: linear-gradient(
        45deg,
        transparent 0%,
        rgba(0, 255, 65, 0.02) 25%,
        transparent 50%,
        rgba(255, 0, 255, 0.02) 75%,
        transparent 100%
      );
      animation: screen-distortion 3s infinite;
    `;
    
    document.body.appendChild(overlay);
  }
}

// Initialize advanced effects
document.addEventListener('DOMContentLoaded', () => {
  const advancedEffects = new AdvancedEffects();
  
  // Add screen distortion effect
  advancedEffects.createScreenDistortion();
  
  // Setup audio reactive effects
  advancedEffects.setupAudioReactive();
  
  // Make globally accessible
  window.advancedEffects = advancedEffects;
});

// Add CSS for screen distortion animation
const style = document.createElement('style');
style.textContent = `
  @keyframes screen-distortion {
    0%, 100% { transform: translateX(0) translateY(0) skewX(0deg); }
    25% { transform: translateX(1px) translateY(-1px) skewX(0.1deg); }
    50% { transform: translateX(-1px) translateY(1px) skewX(-0.1deg); }
    75% { transform: translateX(0.5px) translateY(-0.5px) skewX(0.05deg); }
  }
  
  :root {
    --cyber-primary: #00ff41;
    --cyber-secondary: #00802a;
    --audio-intensity: 0.5;
  }
`;
document.head.appendChild(style);
