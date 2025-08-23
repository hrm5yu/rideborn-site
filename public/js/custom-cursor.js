// Custom Cursor Controller
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.trails = [];
    this.maxTrails = 10;
    this.isMoving = false;
    this.lastX = 0;
    this.lastY = 0;
    this.init();
  }

  init() {
    this.createCursor();
    this.createTrails();
    this.bindEvents();
    this.startTrailAnimation();
  }

  createCursor() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
  }

  createTrails() {
    for (let i = 0; i < this.maxTrails; i++) {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.opacity = (this.maxTrails - i) / this.maxTrails * 0.6;
      trail.style.transform = 'scale(' + (this.maxTrails - i) / this.maxTrails + ')';
      document.body.appendChild(trail);
      this.trails.push({
        element: trail,
        x: 0,
        y: 0,
        delay: i * 2
      });
    }
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.moveCursor(e.clientX, e.clientY);
      this.isMoving = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
    });

    // Mouse enter/leave
    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
      this.trails.forEach(trail => {
        trail.element.style.opacity = '0.6';
      });
    });

    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.trails.forEach(trail => {
        trail.element.style.opacity = '0';
      });
    });

    // Click events
    document.addEventListener('mousedown', () => {
      this.cursor.classList.add('click');
      this.triggerGlitch();
    });

    document.addEventListener('mouseup', () => {
      this.cursor.classList.remove('click');
    });

    // Hover events for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .nav-link, .reset-btn, .drag-handle');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hover');
        this.cursor.style.transform = 'scale(2)';
      });

      element.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hover');
        this.cursor.style.transform = 'scale(1)';
      });
    });

    // Text selection cursor
    const textElements = document.querySelectorAll('h1, h2, h3, p, span, .logo-text, .nav-link');
    
    textElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.cursor.classList.add('text');
      });

      element.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('text');
      });
    });

    // Drag events
    document.addEventListener('dragstart', () => {
      this.cursor.classList.add('drag');
    });

    document.addEventListener('dragend', () => {
      this.cursor.classList.remove('drag');
    });
  }

  moveCursor(x, y) {
    // Update main cursor
    this.cursor.style.left = x + 'px';
    this.cursor.style.top = y + 'px';

    // Update trails with delay
    this.trails.forEach((trail, index) => {
      setTimeout(() => {
        trail.x = x;
        trail.y = y;
        trail.element.style.left = x + 'px';
        trail.element.style.top = y + 'px';
      }, trail.delay);
    });
  }

  startTrailAnimation() {
    // Animate trails
    setInterval(() => {
      if (this.isMoving) {
        this.trails.forEach((trail, index) => {
          const scale = (this.maxTrails - index) / this.maxTrails;
          trail.element.style.transform = `scale(${scale})`;
          trail.element.style.opacity = scale * 0.6;
        });
        this.isMoving = false;
      }
    }, 16); // 60fps
  }

  triggerGlitch() {
    // Random glitch effect on cursor
    if (Math.random() < 0.3) { // 30% chance
      this.cursor.classList.add('glitch');
      setTimeout(() => {
        this.cursor.classList.remove('glitch');
      }, 100);
    }
  }

  // Public method to change cursor style
  setCursorStyle(style) {
    this.cursor.className = `custom-cursor ${style}`;
  }

  // Public method to add custom cursor for specific elements
  addCustomCursor(selector, style) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.setCursorStyle(style);
      });
      element.addEventListener('mouseleave', () => {
        this.setCursorStyle('');
      });
    });
  }

  // Method to add rainbow effect randomly
  addRainbowEffect() {
    setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance
        this.cursor.classList.add('rainbow');
        setTimeout(() => {
          this.cursor.classList.remove('rainbow');
        }, 3000);
      }
    }, 10000);
  }

  // Method to add pulse effect on specific events
  addPulseEffect() {
    this.cursor.classList.add('pulse');
    setTimeout(() => {
      this.cursor.classList.remove('pulse');
    }, 1000);
  }

  // Method to add rotation effect
  addRotationEffect() {
    this.cursor.classList.add('rotate');
    setTimeout(() => {
      this.cursor.classList.remove('rotate');
    }, 2000);
  }
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const customCursor = new CustomCursor();
  
  // Add specific cursor styles for different elements
  customCursor.addCustomCursor('.card', 'hover');
  customCursor.addCustomCursor('.drag-handle', 'drag');
  customCursor.addCustomCursor('input, textarea', 'text');
  customCursor.addCustomCursor('a', 'link');
  customCursor.addCustomCursor('button, .reset-btn', 'button');
  customCursor.addCustomCursor('img', 'image');
  
  // Add rainbow effect
  customCursor.addRainbowEffect();
  
  // Add pulse effect on page load
  setTimeout(() => {
    customCursor.addPulseEffect();
  }, 1000);
  
  // Add rotation effect on first click
  let firstClick = true;
  document.addEventListener('click', () => {
    if (firstClick) {
      customCursor.addRotationEffect();
      firstClick = false;
    }
  });
  
  // Make cursor globally accessible
  window.customCursor = customCursor;
});

// Fallback for browsers that don't support custom cursors
if (!CSS.supports('cursor', 'none')) {
  document.querySelectorAll('*').forEach(element => {
    element.style.cursor = 'default';
  });
}
