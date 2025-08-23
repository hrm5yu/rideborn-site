// Preloader Effects for Cyberpunk/Glitch Style
class PreloaderEffects {
  constructor() {
    this.init();
  }

  init() {
    this.addMatrixEffect();
    this.addGlitchTextEffect();
    this.addParticleEffect();
  }

  addMatrixEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      opacity: 0.1;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    function draw() {
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
    }

    const interval = setInterval(draw, 35);

    // Clean up when preloader is hidden
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const preloader = document.getElementById('preloader');
          if (preloader && preloader.classList.contains('hidden')) {
            clearInterval(interval);
            canvas.remove();
            observer.disconnect();
          }
        }
      });
    });

    // Also check for display: none
    const checkPreloader = setInterval(() => {
      const preloader = document.getElementById('preloader');
      if (preloader && preloader.style.display === 'none') {
        clearInterval(interval);
        canvas.remove();
        observer.disconnect();
        clearInterval(checkPreloader);
      }
    }, 100);

    observer.observe(document.getElementById('preloader'), {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  addGlitchTextEffect() {
    const logoGlitch = document.querySelector('.logo-glitch');
    if (!logoGlitch) return;

    setInterval(() => {
      if (Math.random() < 0.05) {
        logoGlitch.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
        logoGlitch.style.filter = 'hue-rotate(90deg)';
        
        setTimeout(() => {
          logoGlitch.style.transform = 'translate(0, 0)';
          logoGlitch.style.filter = 'none';
        }, 100);
      }
    }, 3000);
  }

  addParticleEffect() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      opacity: 0.3;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.size = Math.random() * 2 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#00ff41';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].life <= 0) {
          particles.splice(i, 1);
          particles.push(new Particle());
        }
      }

      requestAnimationFrame(animate);
    }

    animate();

    // Clean up when preloader is hidden
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const preloader = document.getElementById('preloader');
          if (preloader && preloader.classList.contains('hidden')) {
            canvas.remove();
            observer.disconnect();
          }
        }
      });
    });

    // Also check for display: none
    const checkPreloader = setInterval(() => {
      const preloader = document.getElementById('preloader');
      if (preloader && preloader.style.display === 'none') {
        canvas.remove();
        observer.disconnect();
        clearInterval(checkPreloader);
      }
    }, 100);

    observer.observe(document.getElementById('preloader'), {
      attributes: true,
      attributeFilter: ['class']
    });
  }
}

// Initialize preloader effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Check if this is the first visit
  const hasVisited = sessionStorage.getItem('hasVisited');
  
  // Only show effects on first visit
  if (!hasVisited) {
    new PreloaderEffects();
  }
});
