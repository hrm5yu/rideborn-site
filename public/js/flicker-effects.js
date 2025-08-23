// Random Flicker Effects for Images
class FlickerEffect {
  constructor() {
    this.images = [];
    this.flickerIntervals = [];
    this.init();
  }

  init() {
    this.setupImages();
    this.startRandomFlicker();
    this.startColorShift();
  }

  setupImages() {
    // Get all images in cards
    const cardImages = document.querySelectorAll('.card img, .rb-img');
    this.images = Array.from(cardImages);
    
    console.log(`Found ${this.images.length} images for flicker effect`);
  }

  startRandomFlicker() {
    this.images.forEach((img, index) => {
      // Create individual flicker interval for each image - more subtle
      const interval = setInterval(() => {
        if (Math.random() < 0.2) { // 20% chance to flicker - more subtle
          this.triggerFlicker(img);
        }
      }, Math.random() * 4000 + 2000); // Random interval between 2-6 seconds - slower
      
      this.flickerIntervals.push(interval);
    });
  }

  triggerFlicker(img) {
    const duration = Math.random() * 300 + 200; // 200-500ms - slower flicker
    const intensity = Math.random() * 0.3 + 0.1; // 0.1-0.4 opacity change - more subtle
    
    // Store original styles
    const originalOpacity = img.style.opacity;
    const originalFilter = img.style.filter;
    
    // Apply subtle flicker effect - like aging fluorescent light
    img.style.transition = `all ${duration}ms ease`;
    img.style.opacity = 1 - intensity; // 0.6-0.9 opacity - less dark
    img.style.filter = `brightness(${0.8 + Math.random() * 0.4}) contrast(${1.1 + Math.random() * 0.3}) saturate(${0.9 + Math.random() * 0.2})`;
    
    // Restore original styles
    setTimeout(() => {
      img.style.opacity = originalOpacity || '1';
      img.style.filter = originalFilter || 'none';
    }, duration);
  }

  startColorShift() {
    // Add subtle color shifts to images - like aging fluorescent light
    setInterval(() => {
      this.images.forEach((img, index) => {
        if (Math.random() < 0.1) { // 10% chance - less frequent
          this.triggerColorShift(img);
        }
      });
    }, 8000); // Every 8 seconds - less frequent
  }

  triggerColorShift(img) {
    const duration = Math.random() * 1000 + 500; // 500-1500ms - slower
    const hueShift = Math.random() * 15 - 7.5; // -7.5 to +7.5 degrees - more subtle
    
    // Store original filter
    const originalFilter = img.style.filter;
    
    // Apply subtle color shift - like aging fluorescent light
    img.style.transition = `filter ${duration}ms ease`;
    img.style.filter = `hue-rotate(${hueShift}deg) saturate(${0.9 + Math.random() * 0.2}) brightness(${0.95 + Math.random() * 0.1}) contrast(${1.05 + Math.random() * 0.1})`;
    
    // Restore original filter
    setTimeout(() => {
      img.style.filter = originalFilter || 'none';
    }, duration);
  }

  // Method to add glitch effect randomly - less frequent
  addRandomGlitch() {
    setInterval(() => {
      const randomImage = this.images[Math.floor(Math.random() * this.images.length)];
      if (randomImage && Math.random() < 0.05) { // 5% chance - less frequent
        this.triggerGlitch(randomImage);
      }
    }, 3000); // Every 3 seconds - less frequent
  }

  triggerGlitch(img) {
    const duration = 200; // Slower glitch
    
    // Store original styles
    const originalTransform = img.style.transform;
    const originalFilter = img.style.filter;
    
    // Apply subtle glitch effect - like aging fluorescent light
    img.style.transition = 'none';
    img.style.transform = `translate(${Math.random() * 3 - 1.5}px, ${Math.random() * 3 - 1.5}px) scale(${0.98 + Math.random() * 0.04})`;
    img.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg) saturate(${1.1 + Math.random() * 0.2}) brightness(${0.9 + Math.random() * 0.2}) contrast(${1.1 + Math.random() * 0.2})`;
    
    // Restore original styles
    setTimeout(() => {
      img.style.transition = 'all 0.3s ease';
      img.style.transform = originalTransform || '';
      img.style.filter = originalFilter || 'none';
    }, duration);
  }

  // Method to intensify flicker
  intensifyFlicker() {
    this.images.forEach(img => {
      img.style.animation = 'continuous-flicker 1s infinite';
    });
  }

  // Method to reduce flicker
  reduceFlicker() {
    this.images.forEach(img => {
      img.style.animation = 'continuous-flicker 5s infinite';
    });
  }

  // Cleanup method
  destroy() {
    this.flickerIntervals.forEach(interval => {
      clearInterval(interval);
    });
    this.flickerIntervals = [];
  }
}

// Initialize flicker effects when DOM is loaded
// DISABLED: Flicker effects turned off by user request
/*
document.addEventListener('DOMContentLoaded', () => {
  const flickerEffect = new FlickerEffect();
  
  // Add random glitch effect
  flickerEffect.addRandomGlitch();
  
  // Make flicker effect globally accessible
  window.flickerEffect = flickerEffect;
  
  // Add keyboard controls for testing
  document.addEventListener('keydown', (e) => {
    if (e.key === 'f') {
      // Press 'f' to intensify flicker
      flickerEffect.intensifyFlicker();
    } else if (e.key === 'r') {
      // Press 'r' to reduce flicker
      flickerEffect.reduceFlicker();
    }
  });
});
*/

// Reinitialize flicker effects when new content is loaded
// DISABLED: Flicker effects turned off by user request
/*
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      // Check if new images were added
      const newImages = Array.from(mutation.addedNodes).some(node => 
        node.nodeType === 1 && (node.classList?.contains('card') || node.querySelector?.('img'))
      );
      
      if (newImages && window.flickerEffect) {
        // Reinitialize flicker effects
        window.flickerEffect.destroy();
        window.flickerEffect = new FlickerEffect();
        window.flickerEffect.addRandomGlitch();
      }
    }
  });
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});
*/
