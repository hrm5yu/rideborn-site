// GSAP横スクロール機能
(() => {
  const initGSAPHorizontalScroll = () => {
    // GSAPを動的ロード
    import('https://esm.sh/gsap@3.12.5')
      .then((mod) => {
        const gsap = mod.gsap || mod.default || mod;
        const ScrollTrigger = mod.ScrollTrigger || mod.default?.ScrollTrigger;
        
        if (!ScrollTrigger) {
          console.warn('ScrollTrigger not available, using fallback');
          initFallbackScroll();
          return;
        }
        
        // ScrollTriggerを登録
        gsap.registerPlugin(ScrollTrigger);
        
        const scrollContainer = document.querySelector('.horizontal-scroll-wrapper');
        const cards = document.querySelectorAll('.content-cards.horizontal-scroll .content-card');
        
        if (!scrollContainer || cards.length === 0) return;
        
        // 横スクロールセクション全体をピン留め
        const horizontalSection = document.querySelector('.featured-section');
        
        // 各カードごとのScrollTriggerを設定
        cards.forEach((card, index) => {
          const cardImage = card.querySelector('.card-image img');
          const cardContent = card.querySelector('.card-content');
          
          // 初期状態を設定
          gsap.set(cardImage, {
            scale: 1.1,
            opacity: 0.4
          });
          
          gsap.set(cardContent, {
            y: 50,
            opacity: 0
          });
          
          // 各カードのScrollTrigger
          ScrollTrigger.create({
            trigger: horizontalSection,
            start: `top+=${index * 100}px top`,
            end: `top+=${(index + 1) * 100}px top`,
            pin: true,
            pinSpacing: false,
            scrub: 1,
            onEnter: () => {
              // このカードがアクティブになった時
              gsap.to(scrollContainer, {
                x: -index * window.innerWidth,
                duration: 0.8,
                ease: "power2.inOut"
              });
              
              // アクティブカードのアニメーション
              gsap.to(cardImage, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out"
              });
              
              gsap.to(cardContent, {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power2.out",
                delay: 0.2
              });
              
              // 他のカードを非アクティブ状態に
              cards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                  const otherImage = otherCard.querySelector('.card-image img');
                  const otherContent = otherCard.querySelector('.card-content');
                  
                  const distance = Math.abs(otherIndex - index);
                  const isNearby = distance <= 1;
                  
                  if (isNearby) {
                    // 隣接カード
                    gsap.to(otherImage, {
                      scale: 1.05,
                      opacity: 0.7,
                      duration: 0.8,
                      ease: "power2.out"
                    });
                    
                    gsap.to(otherContent, {
                      y: 30,
                      opacity: 0.5,
                      duration: 0.8,
                      ease: "power2.out"
                    });
                  } else {
                    // 遠いカード
                    gsap.to(otherImage, {
                      scale: 1.1,
                      opacity: 0.4,
                      duration: 0.8,
                      ease: "power2.out"
                    });
                    
                    gsap.to(otherContent, {
                      y: 50,
                      opacity: 0,
                      duration: 0.8,
                      ease: "power2.out"
                    });
                  }
                }
              });
            }
          });
        });
        
        // スムーズな横スクロール
        let isScrolling = false;
        let startX = 0;
        let scrollLeft = 0;
        
        // マウスイベント
        scrollContainer.addEventListener('mousedown', (e) => {
          isScrolling = true;
          scrollContainer.style.cursor = 'grabbing';
          startX = e.pageX - scrollContainer.offsetLeft;
          scrollLeft = scrollContainer.scrollLeft;
          e.preventDefault();
        });
        
        scrollContainer.addEventListener('mouseleave', () => {
          isScrolling = false;
          scrollContainer.style.cursor = 'grab';
        });
        
        scrollContainer.addEventListener('mouseup', () => {
          isScrolling = false;
          scrollContainer.style.cursor = 'grab';
        });
        
        scrollContainer.addEventListener('mousemove', (e) => {
          if (!isScrolling) return;
          e.preventDefault();
          const x = e.pageX - scrollContainer.offsetLeft;
          const walk = (x - startX) * 2;
          scrollContainer.scrollLeft = scrollLeft - walk;
        });
        
        // マウスホイールで横スクロール（ScrollTriggerと連動）
        let currentCardIndex = 0;
        
        scrollContainer.addEventListener('wheel', (e) => {
          e.preventDefault();
          
          if (e.deltaY > 0) {
            // 下スクロール：次のカードへ
            if (currentCardIndex < cards.length - 1) {
              currentCardIndex++;
              // 次のカードのScrollTriggerを手動でトリガー
              const nextTrigger = ScrollTrigger.getAll().find(trigger => 
                trigger.trigger === horizontalSection && 
                trigger.vars.start.includes(`${currentCardIndex * 100}px`)
              );
              if (nextTrigger) {
                nextTrigger.refresh();
              }
            }
          } else {
            // 上スクロール：前のカードへ
            if (currentCardIndex > 0) {
              currentCardIndex--;
              // 前のカードのScrollTriggerを手動でトリガー
              const prevTrigger = ScrollTrigger.getAll().find(trigger => 
                trigger.trigger === horizontalSection && 
                trigger.vars.start.includes(`${currentCardIndex * 100}px`)
              );
              if (prevTrigger) {
                prevTrigger.refresh();
              }
            }
          }
          
          // 横スクロールの位置を更新
          gsap.to(scrollContainer, {
            x: -currentCardIndex * window.innerWidth,
            duration: 0.8,
            ease: "power2.inOut"
          });
        });
        
        // タッチイベント（モバイル対応）
        let touchStartX = 0;
        let touchStartScroll = 0;
        let touchVelocity = 0;
        let touchStartTime = 0;
        
        scrollContainer.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].pageX;
          touchStartScroll = scrollContainer.scrollLeft;
          touchStartTime = Date.now();
          touchVelocity = 0;
        });
        
        scrollContainer.addEventListener('touchmove', (e) => {
          e.preventDefault();
          const currentX = e.touches[0].pageX;
          const deltaX = touchStartX - currentX;
          const currentTime = Date.now();
          const deltaTime = currentTime - touchStartTime;
          
          if (deltaTime > 0) {
            touchVelocity = deltaX / deltaTime;
          }
          
          scrollContainer.scrollLeft = touchStartScroll + deltaX;
        });
        
        scrollContainer.addEventListener('touchend', () => {
          // スワイプの速度に基づいてスナップ
          let snapIndex = currentCardIndex;
          
          if (Math.abs(touchVelocity) > 0.5) {
            // 高速スワイプの場合は速度に基づいてスナップ
            if (touchVelocity > 0 && currentCardIndex < cards.length - 1) {
              snapIndex = currentCardIndex + 1;
            } else if (touchVelocity < 0 && currentCardIndex > 0) {
              snapIndex = currentCardIndex - 1;
            }
          }
          
          currentCardIndex = snapIndex;
          
          // 横スクロールの位置を更新
          gsap.to(scrollContainer, {
            x: -currentCardIndex * window.innerWidth,
            duration: 0.6,
            ease: "power2.inOut"
          });
          
          touchStartX = 0;
          touchStartScroll = 0;
          touchVelocity = 0;
        });
        
        // 初期カーソル設定
        scrollContainer.style.cursor = 'grab';
        
      })
      .catch(() => {
        console.warn('GSAP failed to load, using fallback');
        initFallbackScroll();
      });
  };
  
  // フォールバック機能
  const initFallbackScroll = () => {
    const scrollContainers = document.querySelectorAll('.horizontal-scroll-wrapper');
    
    scrollContainers.forEach(container => {
      let isScrolling = false;
      let startX = 0;
      let scrollLeft = 0;
      
      // マウスイベント
      container.addEventListener('mousedown', (e) => {
        isScrolling = true;
        container.style.cursor = 'grabbing';
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
        e.preventDefault();
      });
      
      container.addEventListener('mouseleave', () => {
        isScrolling = false;
        container.style.cursor = 'grab';
      });
      
      container.addEventListener('mouseup', () => {
        isScrolling = false;
        container.style.cursor = 'grab';
      });
      
      container.addEventListener('mousemove', (e) => {
        if (!isScrolling) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2;
        container.scrollLeft = scrollLeft - walk;
      });
      
      // マウスホイールで横スクロール
      container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const scrollAmount = e.deltaY * 0.5;
        container.scrollLeft += scrollAmount;
      });
      
      // タッチイベント（モバイル対応）
      container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
      });
      
      container.addEventListener('touchmove', (e) => {
        if (!startX) return;
        const x = e.touches[0].pageX - container.offsetLeft;
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
      });
      
      container.addEventListener('touchend', () => {
        startX = 0;
      });
      
      // 初期カーソル設定
      container.style.cursor = 'grab';
    });
  };
  
  // DOM読み込み完了後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGSAPHorizontalScroll);
  } else {
    initGSAPHorizontalScroll();
  }
})();

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

// ロゴアニメーション
(() => {
  const logoChars = document.querySelectorAll('.logo-char');
  const logoSubtitle = document.querySelector('.logo-subtitle');
  const logoTitleContainer = document.querySelector('.logo-text-container');

  if (logoChars.length > 0) {
    // GSAPが利用可能な場合はGSAPを使用
    if (typeof window !== 'undefined') {
      // ESM対応ビルドを動的ロード（window汚染を回避）
      import('https://esm.sh/gsap@3.12.5')
        .then((mod) => {
          const gsap = mod.gsap || mod.default || mod;

          // 統一されたアニメーションシーケンス
          const tl = gsap.timeline();

          // メインタイトル全体を左からスライドイン（opacity + x移動）
          if (logoTitleContainer) {
            tl.fromTo(logoTitleContainer,
              {
                x: '-120%',
                opacity: 0
              },
              {
                x: '0%',
                opacity: 1,
                duration: 1.0,
                ease: 'power3.out'
              }
            );
          }

          // サブタイトルのアニメーション（上からスライドイン）
          if (logoSubtitle) {
            tl.fromTo(logoSubtitle,
              {
                opacity: 0,
                y: -30
              },
              {
                opacity: 0.9,
                y: 0,
                duration: 0.8,
                ease: "power2.out"
              },
              '-=0.2'  // 前のアニメーションと0.2秒重複
            );
          }

          // アニメーション完了後に自動スクロール
          tl.call(() => {
            setTimeout(() => {
              // スクロールを有効化
              document.documentElement.classList.add('scroll-enabled');
              document.body.style.overflow = 'auto';
              
              // Featured Content セクションにスムーズスクロール
              const featuredSection = document.querySelector('.featured-section');
              if (featuredSection) {
                featuredSection.scrollIntoView({ 
                  behavior: 'smooth',
                  block: 'start'
                });
                
                // スクロール完了後に注目コンテンツをアニメーション
                setTimeout(() => {
                  const featuredCategories = document.querySelectorAll('.featured-category');
                  featuredCategories.forEach((category, index) => {
                    setTimeout(() => {
                      category.classList.add('animate');
                    }, index * 200);
                  });
                  
                  // 注目コンテンツ完了後にコンセプトセクションにスクロール
                  setTimeout(() => {
                    const conceptSection = document.querySelector('.concept-section');
                    if (conceptSection) {
                      conceptSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                      
                      // コンセプトカードをアニメーション
                      setTimeout(() => {
                        const conceptMission = document.querySelector('.concept-mission');
                        const conceptVision = document.querySelector('.concept-vision');
                        
                        if (conceptMission) conceptMission.classList.add('animate');
                        setTimeout(() => {
                          if (conceptVision) conceptVision.classList.add('animate');
                        }, 200);
                      }, 1000);
                    }
                  }, 2000);
                }, 1000);
              }
            }, 1500); // アニメーション完了後1.5秒待機
          });
        })
        .catch(() => {
          // フォールバック: CSSクラスで簡易アニメーション
          logoChars.forEach((char, index) => {
            setTimeout(() => {
              char.classList.add('animate');
            }, 500 + (index * 100));
          });
          if (logoSubtitle) {
            setTimeout(() => {
              logoSubtitle.classList.add('animate');
            }, 1500);
          }
        });
    } else {
      // GSAPが利用できない場合はCSSアニメーションを使用
      logoChars.forEach((char, index) => {
        setTimeout(() => {
          char.classList.add('animate');
        }, 500 + (index * 100));
      });

      if (logoSubtitle) {
        setTimeout(() => {
          logoSubtitle.classList.add('animate');
        }, 1500);
      }
    }
  }
})();

// ファーストビューのスクロール制御
(() => {
  const isHomePage = window.location.pathname === '/rideborn-site/' || window.location.pathname === '/';
  
  if (isHomePage) {
    // ホームページではスクロールを無効化
    document.documentElement.classList.remove('scroll-enabled');
    document.body.style.overflow = 'hidden';
  } else {
    // 他のページではスクロールを有効化
    document.documentElement.classList.add('scroll-enabled');
    document.body.style.overflow = 'auto';
  }
})();
