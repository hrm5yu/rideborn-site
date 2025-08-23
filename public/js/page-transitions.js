// Lightweight Page Transition Effects for Cyberpunk Style
class PageTransitions {
  constructor() {
    this.init();
  }

  init() {
    // Check if this is the first visit (same as preloader)
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    // Only enable page transitions after first visit
    if (hasVisited) {
      this.addTransitionOverlay();
      this.handlePageTransitions();
    }
  }

  addTransitionOverlay() {
    // Create minimal transition overlay
    const overlay = document.createElement('div');
    overlay.id = 'page-transition-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000;
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease, visibility 0.15s ease;
      pointer-events: none;
      overflow: hidden;
    `;
    
    // Add subtle scanlines effect
    const scanlines = document.createElement('div');
    scanlines.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0, 255, 65, 0.03) 3px,
        rgba(0, 255, 65, 0.03) 6px
      );
      pointer-events: none;
      animation: scanlines-subtle 0.2s linear infinite;
    `;
    
    // Add minimal corner indicator
    const cornerIndicator = document.createElement('div');
    cornerIndicator.id = 'transition-indicator';
    cornerIndicator.style.cssText = `
      position: absolute;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border: 2px solid #00ff41;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;
    `;
    
    // Add inner circle animation
    const innerCircle = document.createElement('div');
    innerCircle.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 20px;
      height: 20px;
      background: #00ff41;
      border-radius: 50%;
      animation: pulse 0.8s ease-in-out infinite;
    `;
    
    cornerIndicator.appendChild(innerCircle);
    
    // Add subtle corner text
    const cornerText = document.createElement('div');
    cornerText.style.cssText = `
      position: absolute;
      top: 70px;
      right: 20px;
      font-family: "Courier New", "Monaco", monospace;
      font-size: 0.7rem;
      color: #00ff41;
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;
      text-align: right;
    `;
    cornerText.textContent = 'TRANSITION';
    
    overlay.appendChild(scanlines);
    overlay.appendChild(cornerIndicator);
    overlay.appendChild(cornerText);
    document.body.appendChild(overlay);
  }

  handlePageTransitions() {
    // Handle internal links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      
      // Check if it's an internal link
      if (href.startsWith('/') || href.startsWith(window.location.origin)) {
        e.preventDefault();
        this.transitionToPage(href);
      }
    });

    // Handle browser back/forward
    window.addEventListener('popstate', () => {
      this.showTransition();
    });
  }

  transitionToPage(url) {
    this.showTransition();
    
    setTimeout(() => {
      window.location.href = url;
    }, 200);
  }

  showTransition() {
    const overlay = document.getElementById('page-transition-overlay');
    const indicator = document.getElementById('transition-indicator');
    const cornerText = overlay?.querySelector('div:last-child');
    
    if (!overlay || !indicator) return;
    
    // Show overlay
    overlay.style.visibility = 'visible';
    overlay.style.opacity = '1';
    
    // Show corner indicator
    setTimeout(() => {
      indicator.style.opacity = '1';
      if (cornerText) cornerText.style.opacity = '1';
    }, 50);
    
    // Add subtle glitch effect
    this.addSubtleGlitch(overlay);
  }

  addSubtleGlitch(overlay) {
    // Single subtle glitch flash
    setTimeout(() => {
      overlay.style.background = 'linear-gradient(45deg, transparent 0%, rgba(0, 255, 65, 0.05) 50%, transparent 100%)';
      setTimeout(() => {
        overlay.style.background = '#000';
      }, 30);
    }, 100);
  }

  hideTransition() {
    const overlay = document.getElementById('page-transition-overlay');
    const indicator = document.getElementById('transition-indicator');
    const cornerText = overlay?.querySelector('div:last-child');
    
    if (!overlay || !indicator) return;
    
    // Hide elements
    indicator.style.opacity = '0';
    if (cornerText) cornerText.style.opacity = '0';
    
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.visibility = 'hidden';
      }, 150);
    }, 50);
  }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes scanlines-subtle {
    0% { transform: translateY(0); }
    100% { transform: translateY(6px); }
  }
  
  @keyframes pulse {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.8;
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

// Initialize page transitions
document.addEventListener('DOMContentLoaded', () => {
  new PageTransitions();
  
  // Hide transition overlay after page load
  setTimeout(() => {
    const pageTransitions = new PageTransitions();
    pageTransitions.hideTransition();
  }, 50);
});

