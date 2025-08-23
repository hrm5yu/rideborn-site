// Sortable.js with smooth animations and scroll
(() => {
  console.log('=== Sortable.js初期化開始 ===');
  console.log('Script loaded');
  
  // Check if Sortable is available
  if (typeof Sortable === 'undefined') {
    console.error('Sortable is not loaded!');
    return;
  }
  
  console.log('Sortable is available:', Sortable);
  
  const container = document.querySelector('[data-sortable-container]');
  if (!container) {
    console.log('Container not found');
    return;
  }
  
  console.log('Container found:', container);
  console.log('Cards found:', container.querySelectorAll('[data-card]').length);

  const STORAGE_KEY = 'gallery-order';
  


  // Save current order
  const saveOrder = () => {
    const cards = Array.from(container.querySelectorAll('[data-card]'));
    const order = cards.map(card => card.getAttribute('data-post-id'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(order));
    console.log('Order saved:', order);
  };

  // Restore saved order
  const restoreOrder = () => {
    const savedOrder = localStorage.getItem(STORAGE_KEY);
    if (!savedOrder) return;

    try {
      const order = JSON.parse(savedOrder);
      const cards = Array.from(container.querySelectorAll('[data-card]'));
      
      order.forEach(postId => {
        const card = cards.find(c => c.getAttribute('data-post-id') === postId);
        if (card) {
          container.appendChild(card);
        }
      });
      console.log('Order restored');
    } catch (e) {
      console.error('Failed to restore order:', e);
    }
  };



  // Initialize Sortable with smooth animations and scroll
  try {
    // Restore order first
    restoreOrder();
    
    // PC版とモバイル版で設定を分離
    const isMobile = window.innerWidth <= 768;
    
    const sortable = new Sortable(container, {
      // 基本設定
      animation: isMobile ? 150 : 300, // モバイルでは短縮、PCでは標準
      easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      handle: '.drag-handle',
      // カードリンクのフィルターを削除してドラッグを改善
      // filter: '.card-link',
      // preventOnFilter: false,
      swapThreshold: 0.3, // スワップしやすくする
      // グリッドレイアウトでの並べ替えを改善
      group: 'gallery-cards',
      sort: true,
      disabled: false,
      invertSwap: true, // 並べ替えを有効化
      // 全方向の移動を許可（上下左右）
      // direction: 'vertical', // この行をコメントアウト
      scroll: true,
      scrollSensitivity: isMobile ? 80 : 80, // モバイルでは標準感度に調整
      scrollSpeed: isMobile ? 15 : 25, // モバイルでは低速に調整
      scrollContainer: document.documentElement,
      // モバイルでのみフォールバックを有効化
      forceFallback: isMobile, // モバイルでのみフォールバックを使用
      fallbackClass: 'sortable-fallback',
      fallbackOnBody: isMobile, // モバイルでのみbodyに要素を追加
      // タッチデバイスでのドラッグを改善（モバイルでのみ）
      supportTouch: true,
      // モバイルでのみタッチ感度を調整
      touchStartThreshold: isMobile ? 1 : 3, // モバイルでは低閾値、PCでは標準
      delay: isMobile ? 50 : 0, // モバイルでのみ遅延
      delayOnTouchOnly: true, // タッチデバイスでのみ遅延を適用
      onStart: function (evt) {
        console.log('=== ドラッグ開始 ===');
        console.log('Drag started');
        console.log('ドラッグされた要素:', evt.item);
        console.log('ドラッグハンドル:', evt.item.querySelector('.drag-handle'));
        evt.item.style.zIndex = '1000';
        document.body.style.userSelect = 'none';
        
        // モバイルでのみスクロール改善を適用
        if (isMobile) {
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
        }
        
        // ドラッグ中のカーソルスタイルを追加
        evt.item.classList.add('dragging');
      },
      onEnd: function (evt) {
        console.log('Drag ended');
        evt.item.style.zIndex = '';
        document.body.style.overflow = '';
        document.body.style.userSelect = '';
        document.documentElement.style.overflow = '';
        saveOrder();
        
        // ドラッグ中のカーソルスタイルを削除
        evt.item.classList.remove('dragging');
      },
      onUpdate: function (evt) {
        console.log('Order updated');
        saveOrder();
      },
      onMove: function (evt) {
        console.log('Moving...', evt.dragged, evt.related);
        console.log('From index:', evt.oldIndex, 'To index:', evt.newIndex);
        return true;
      },
      onAdd: function (evt) {
        console.log('Item added:', evt.item);
        saveOrder();
      },
      onRemove: function (evt) {
        console.log('Item removed:', evt.item);
        saveOrder();
      },
      onSort: function (evt) {
        console.log('Sort completed:', evt);
        saveOrder();
      }
    });
    
    console.log('=== Sortable初期化完了 ===');
    console.log('Sortable initialized successfully');
    console.log('ドラッグハンドル:', document.querySelectorAll('.drag-handle').length, '個');
    console.log('カード数:', document.querySelectorAll('[data-card]').length, '個');
    
    // ドラッグハンドルのクリックイベントをテスト
    document.querySelectorAll('.drag-handle').forEach((handle, index) => {
      console.log(`ドラッグハンドル ${index + 1}:`, handle);
      handle.addEventListener('click', (e) => {
        console.log(`ドラッグハンドル ${index + 1} がクリックされました`);
      });
    });
  } catch (error) {
    console.error('Error initializing Sortable:', error);
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

  // Shuffle cards with animation
  const shuffleCards = () => {
    const cards = Array.from(container.querySelectorAll('[data-card]'));
    const shuffledCards = shuffleArray(cards);
    
    // Add shuffle animation
    cards.forEach((card, index) => {
      card.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      card.style.transform = 'scale(0.8) rotate(' + (Math.random() * 20 - 10) + 'deg)';
      card.style.opacity = '0.5';
    });
    
    // Reorder cards
    setTimeout(() => {
      shuffledCards.forEach(card => {
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

  // Shuffle button
  const shuffleBtn = document.querySelector('[data-shuffle]');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      shuffleCards();
      
      // Add glitch effect to button
      shuffleBtn.style.animation = 'glitch 0.3s ease';
      setTimeout(() => {
        shuffleBtn.style.animation = '';
      }, 300);
    });
  }

  // Reset button
  const resetBtn = document.querySelector('[data-sort-reset]');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
  }
})();
