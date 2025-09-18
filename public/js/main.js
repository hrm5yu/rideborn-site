// Gallery functionality with pin feature
(() => {
  console.log('=== Gallery functionality with pin feature initialized ===');
  
  const container = document.querySelector('[data-sortable-container]');
  if (!container) {
    console.log('Container not found');
    return;
  }
  
  console.log('Container found:', container);
  console.log('Cards found:', container.querySelectorAll('[data-card]').length);

  const STORAGE_KEY = 'gallery-order';
  const PINNED_KEY = 'pinned-cards';
  
  // Save current order
  const saveOrder = () => {
    const cards = Array.from(container.querySelectorAll('[data-card]'));
    const order = cards.map(card => card.getAttribute('data-post-id'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    console.log('Order saved:', order);
  };

  // Save pinned cards
  const savePinnedCards = () => {
    const pinnedCards = Array.from(document.querySelectorAll('.pin-button.pinned'))
      .map(button => button.closest('[data-card]').getAttribute('data-post-id'));
    localStorage.setItem(PINNED_KEY, JSON.stringify(pinnedCards));
    console.log('Pinned cards saved:', pinnedCards);
  };

  // Restore saved order
  const restoreOrder = () => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    const pinnedCards = JSON.parse(localStorage.getItem(PINNED_KEY) || '[]');
    
    if (!savedOrder) return;

    try {
      const order = JSON.parse(savedOrder);
      const cards = Array.from(container.querySelectorAll('[data-card]'));
      
      // Separate pinned and unpinned cards
      const pinned = [];
      const unpinned = [];
      
      order.forEach(postId => {
        const card = cards.find(c => c.getAttribute('data-post-id') === postId);
        if (card) {
          if (pinnedCards.includes(postId)) {
            pinned.push(card);
          } else {
            unpinned.push(card);
          }
        }
      });
      
      // Add pinned cards first, then unpinned
      [...pinned, ...unpinned].forEach(card => {
        container.appendChild(card);
      });
      
      // Restore pin states
      pinnedCards.forEach(postId => {
        const card = cards.find(c => c.getAttribute('data-post-id') === postId);
        if (card) {
          const pinButton = card.querySelector('.pin-button');
          if (pinButton) {
            pinButton.classList.add('pinned');
          }
        }
      });
      
      console.log('Order restored with pinned cards');
    } catch (e) {
      console.error('Failed to restore order:', e);
    }
  };

  // Initialize on page load
  try {
    restoreOrder();
    console.log('=== Gallery functionality ready ===');
  } catch (error) {
    console.error('Error initializing gallery:', error);
  }

  // Shuffle function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Shuffle cards with animation (respecting pinned cards)
  const shuffleCards = () => {
    const cards = Array.from(container.querySelectorAll('[data-card]'));
    const pinnedCards = cards.filter(card => card.querySelector('.pin-button.pinned'));
    const unpinnedCards = cards.filter(card => !card.querySelector('.pin-button.pinned'));
    
    // Only shuffle unpinned cards
    const shuffledUnpinnedCards = shuffleArray(unpinnedCards);
    
    // Add shuffle animation
    cards.forEach((card, index) => {
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.transform = 'scale(0.8) rotate(' + (Math.random() * 20 - 10) + 'deg)';
      card.style.opacity = '0.5';
    });
    
    // Reorder cards: pinned first, then shuffled unpinned
    setTimeout(() => {
      [...pinnedCards, ...shuffledUnpinnedCards].forEach(card => {
        container.appendChild(card);
      });
      
      // Restore cards with animation
      setTimeout(() => {
        cards.forEach(card => {
          card.style.transform = 'scale(1) rotate(0deg)';
          card.style.opacity = '1';
        });
        
        // Save new order
        saveOrder();
      }, 100);
    }, 300);
  };

  // Pin/unpin functionality
  const togglePin = (pinButton) => {
    const card = pinButton.closest('[data-card]');
    const isPinned = pinButton.classList.contains('pinned');
    
    if (isPinned) {
      // Unpin
      pinButton.classList.remove('pinned');
      console.log('Card unpinned:', card.getAttribute('data-post-id'));
    } else {
      // Pin
      pinButton.classList.add('pinned');
      // Move pinned card to the top
      const pinnedCards = Array.from(container.querySelectorAll('[data-card]'))
        .filter(c => c.querySelector('.pin-button.pinned'));
      const unpinnedCards = Array.from(container.querySelectorAll('[data-card]'))
        .filter(c => !c.querySelector('.pin-button.pinned'));
      
      // Reorder: pinned cards first, then unpinned
      [...pinnedCards, ...unpinnedCards].forEach(c => {
        container.appendChild(c);
      });
      
      console.log('Card pinned:', card.getAttribute('data-post-id'));
    }
    
    savePinnedCards();
    saveOrder();
  };

  // Initialize pin buttons
  const initializePinButtons = () => {
    document.querySelectorAll('.pin-button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        togglePin(button);
      });
    });
  };

  // Initialize pin buttons after DOM is ready
  setTimeout(initializePinButtons, 100);

  // Shuffle button
  const shuffleBtn = document.querySelector('[data-shuffle]');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      shuffleCards();
    });
  }

  // Reset button
  const resetBtn = document.querySelector('[data-sort-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PINNED_KEY);
      location.reload();
    });
  }
})();

// Enhanced scroll experience with torque feeling
(() => {
  console.log('=== Enhanced scroll experience initialized ===');
  
  let isScrolling = false;
  let scrollTimeout;
  let lastScrollY = 0;
  let scrollVelocity = 0;
  
  // スクロールの重さとトルク感を調整
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const deltaY = currentScrollY - lastScrollY;
    
    // スクロール速度を計算
    scrollVelocity = Math.abs(deltaY);
    
    // スクロール中の視覚的フィードバック
    if (scrollVelocity > 5) {
      document.body.style.setProperty('--scroll-intensity', Math.min(scrollVelocity / 20, 1));
    }
    
    lastScrollY = currentScrollY;
    
    // スクロール終了の検出
    clearTimeout(scrollTimeout);
    isScrolling = true;
    
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
      document.body.style.setProperty('--scroll-intensity', 0);
    }, 150);
  };
  
  // マウスホイールの慣性を調整
  const handleWheel = (e) => {
    // スクロールの重さを感じさせるため、少し遅延を追加
    if (Math.abs(e.deltaY) > 50) {
      e.preventDefault();
      
      const scrollAmount = e.deltaY * 0.8; // スクロール量を調整
      window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  // タッチデバイスでの慣性スクロールを調整
  let touchStartY = 0;
  let touchStartTime = 0;
  
  const handleTouchStart = (e) => {
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  };
  
  const handleTouchMove = (e) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    const deltaTime = Date.now() - touchStartTime;
    
    // タッチスクロールの慣性を調整
    if (Math.abs(deltaY) > 10 && deltaTime > 50) {
      const scrollAmount = deltaY * 0.6; // タッチスクロールの重さを調整
      window.scrollBy(0, scrollAmount);
    }
  };
  
  // イベントリスナーを追加
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('wheel', handleWheel, { passive: false });
  window.addEventListener('touchstart', handleTouchStart, { passive: true });
  window.addEventListener('touchmove', handleTouchMove, { passive: false });
  
  // CSS変数でスクロール強度を制御
  document.documentElement.style.setProperty('--scroll-intensity', '0');
})();