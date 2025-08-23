// GSAP Advanced Glitch Effects
// GSAP is loaded globally from CDN

class GSAPGlitchEffect {
  constructor() {
    this.init();
  }

  init() {
    // Wait for GSAP to load
    if (typeof gsap !== 'undefined') {
      this.setupEffects();
    } else {
      // Fallback if GSAP is not loaded
      setTimeout(() => this.init(), 100);
    }
  }

  setupEffects() {
    // Add glitch effect to images on hover
    const images = document.querySelectorAll('.card img, .rb-img');
    
    images.forEach(img => {
      const container = img.parentElement;
      
      container.addEventListener('mouseenter', () => {
        this.triggerGSAPGlitch(img);
      });
      
      container.addEventListener('mouseleave', () => {
        this.stopGSAPGlitch(img);
      });
    });

    // Add random glitch to page elements
    this.setupRandomGlitches();
  }

  triggerGSAPGlitch(img) {
    // Create glitch timeline
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Random glitch intervals
    const glitchInterval = setInterval(() => {
      const duration = Math.random() * 0.2 + 0.1;
      const intensity = Math.random() * 0.3 + 0.1;
      
      tl.to(img, {
        duration: duration,
        x: Math.random() * 4 - 2,
        y: Math.random() * 4 - 2,
        rotation: Math.random() * 2 - 1,
        scale: 1 + Math.random() * 0.1,
        ease: "power2.inOut"
      });
      
      // Add color channel separation
      this.addColorSeparation(img, intensity);
      
    }, Math.random() * 1000 + 500);
    
    img.glitchInterval = glitchInterval;
    img.glitchTimeline = tl;
  }

  stopGSAPGlitch(img) {
    if (img.glitchInterval) {
      clearInterval(img.glitchInterval);
    }
    if (img.glitchTimeline) {
      img.glitchTimeline.kill();
    }
    
    // Reset image
    gsap.to(img, {
      duration: 0.3,
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      ease: "power2.out"
    });
    
    // Remove color separation
    this.removeColorSeparation(img);
  }

  addColorSeparation(img, intensity) {
    // Create color separation layers
    const layers = ['red', 'green', 'blue'];
    
    layers.forEach((color, index) => {
      const layer = document.createElement('div');
      layer.className = `color-layer ${color}-layer`;
      layer.style.cssText = `
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
        z-index: ${index + 1};
      `;
      
      img.parentElement.appendChild(layer);
      
      // Animate color layer
      gsap.to(layer, {
        duration: 0.2,
        opacity: intensity,
        x: Math.random() * 6 - 3,
        y: Math.random() * 6 - 3,
        ease: "power2.inOut"
      });
      
      // Store layer reference
      if (!img.colorLayers) img.colorLayers = [];
      img.colorLayers.push(layer);
    });
  }

  removeColorSeparation(img) {
    if (img.colorLayers) {
      img.colorLayers.forEach(layer => {
        gsap.to(layer, {
          duration: 0.3,
          opacity: 0,
          x: 0,
          y: 0,
          ease: "power2.out",
          onComplete: () => {
            if (layer.parentElement) {
              layer.parentElement.removeChild(layer);
            }
          }
        });
      });
      img.colorLayers = [];
    }
  }

  setupRandomGlitches() {
    // Random glitch effect on page elements
    setInterval(() => {
      const elements = document.querySelectorAll('h1, h2, h3, .logo-text, .nav-link');
      const randomElement = elements[Math.floor(Math.random() * elements.length)];
      
      if (randomElement && Math.random() < 0.15) { // 15% chance
        this.triggerElementGlitch(randomElement);
      }
    }, 3000);
  }

  triggerElementGlitch(element) {
    const originalText = element.textContent;
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Create glitch effect
    const glitchTimeline = gsap.timeline();
    
    // Random character replacement
    for (let i = 0; i < 3; i++) {
      glitchTimeline.to(element, {
        duration: 0.05,
        text: this.generateGlitchText(originalText, glitchChars),
        ease: "none"
      }).to(element, {
        duration: 0.05,
        text: originalText,
        ease: "none"
      });
    }
    
    // Position glitch
    glitchTimeline.to(element, {
      duration: 0.1,
      x: Math.random() * 4 - 2,
      y: Math.random() * 4 - 2,
      ease: "power2.inOut"
    }).to(element, {
      duration: 0.1,
      x: 0,
      y: 0,
      ease: "power2.out"
    });
  }

  generateGlitchText(originalText, glitchChars) {
    let glitchText = originalText;
    const numChanges = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numChanges; i++) {
      const randomIndex = Math.floor(Math.random() * originalText.length);
      const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      glitchText = glitchText.substring(0, randomIndex) + randomChar + glitchText.substring(randomIndex + 1);
    }
    
    return glitchText;
  }
}

// Initialize GSAP effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new GSAPGlitchEffect();
});

// Export for use in other modules
export { GSAPGlitchEffect };
