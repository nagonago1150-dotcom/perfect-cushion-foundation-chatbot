class PerfectOneChatbot {
    constructor() {
        this.chatContainer = document.getElementById('chatbot-container');
        this.chatTrigger = document.getElementById('chatbot-trigger');
        this.chatClose = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.optionsContainer = document.getElementById('chatbot-options');

        this.currentState = 'initial';
        this.selectedConcern = null;
        this.conversationStep = 0;
        this.totalSteps = 3;

        this.init();
    }
    
    init() {
        this.chatTrigger.addEventListener('click', () => {
            this.openChat();
            this.showInitialMessage();
        });
        this.chatClose.addEventListener('click', () => this.closeChat());
    }
    
    openChat() {
        this.chatContainer.classList.add('open');
        this.chatContainer.style.display = 'flex';

        // Trigger animation
        setTimeout(() => {
            this.chatContainer.style.opacity = '1';
            this.chatContainer.style.transform = 'translateY(0) scale(1)';
        }, 10);

        // Hide trigger with fade out
        this.chatTrigger.style.opacity = '0';
        this.chatTrigger.style.transform = 'scale(0.5)';
        setTimeout(() => {
            this.chatTrigger.style.display = 'none';
        }, 300);
    }

    closeChat() {
        // Animate close
        this.chatContainer.style.opacity = '0';
        this.chatContainer.style.transform = 'translateY(100%) scale(0.8)';

        setTimeout(() => {
            this.chatContainer.classList.remove('open');
            this.chatContainer.style.display = 'none';

            // Show trigger with fade in
            this.chatTrigger.style.display = 'flex';
            setTimeout(() => {
                this.chatTrigger.style.opacity = '1';
                this.chatTrigger.style.transform = 'scale(1)';
            }, 10);

            // チャット履歴をリセット
            this.resetChat();
        }, 300);
    }
    
    resetChat() {
        this.messagesContainer.innerHTML = '';
        this.optionsContainer.innerHTML = '';
        this.currentState = 'initial';
        this.selectedConcern = null;
    }
    
    addMessage(content, isBot = true, isHTML = false, useTyping = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isBot ? 'bot' : 'user'}`;
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
        messageDiv.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        this.messagesContainer.appendChild(messageDiv);

        // Fade in animation
        setTimeout(() => {
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);

        if (isBot && useTyping && !isHTML) {
            // Show typing indicator first
            this.showTypingIndicator(contentDiv);

            setTimeout(() => {
                this.hideTypingIndicator(contentDiv);
                this.typeText(contentDiv, content);
            }, 600);
        } else {
            if (isHTML) {
                contentDiv.innerHTML = content;
            } else {
                contentDiv.textContent = content;
            }
        }

        messageDiv.appendChild(contentDiv);

        // スムーズスクロール
        setTimeout(() => {
            this.messagesContainer.scrollTo({
                top: this.messagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);

        return messageDiv;
    }

    showTypingIndicator(container) {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        container.appendChild(typingDiv);
    }

    hideTypingIndicator(container) {
        const typingDiv = container.querySelector('.typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    typeText(container, text, speed = 30) {
        let index = 0;
        container.textContent = '';

        const type = () => {
            if (index < text.length) {
                container.textContent += text.charAt(index);
                index++;
                setTimeout(type, speed);

                // スクロール
                this.messagesContainer.scrollTo({
                    top: this.messagesContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }
        };

        type();
    }
    
    showOptions(options) {
        this.optionsContainer.innerHTML = '';

        options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-button';
            if (option.isCTA) {
                button.classList.add('cta-option');
            }
            button.textContent = option.text;
            button.dataset.optionId = option.id;

            // Stagger animation
            button.style.opacity = '0';
            button.style.transform = 'translateY(10px)';
            setTimeout(() => {
                button.style.transition = 'all 0.3s ease';
                button.style.opacity = '1';
                button.style.transform = 'translateY(0)';
            }, index * 100);

            button.addEventListener('click', (e) => {
                this.createRipple(e, button);
                setTimeout(() => {
                    this.handleOptionClick(option);
                }, 300);
            });

            this.optionsContainer.appendChild(button);
        });
    }

    createRipple(event, button) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';

        button.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    updateProgress() {
        this.conversationStep++;
        const progressBar = document.getElementById('chat-progress-bar');
        if (progressBar) {
            const percentage = (this.conversationStep / this.totalSteps) * 100;
            progressBar.style.width = percentage + '%';
        }
    }
    
    showInitialMessage() {
        // メッセージが既に表示されている場合はスキップ
        if (this.messagesContainer.children.length > 0) {
            return;
        }

        this.addMessage('こんにちは！パーフェクトワン 美容アドバイザーです😊');

        setTimeout(() => {
            this.addMessage('どのようなお悩みでお困りですか？');
            setTimeout(() => {
                this.showOptions([
                    { id: 'coverage', text: 'シミ・毛穴が隠れない' },
                    { id: 'texture', text: '厚塗り感・ツヤのなさ' },
                    { id: 'lasting', text: '夕方のメイク崩れ' }
                ]);
            }, 800);
        }, 1000);
    }
    
    handleOptionClick(option) {
        this.addMessage(option.text, false);
        
        this.optionsContainer.innerHTML = '';
        
        setTimeout(() => {
            if (option.id === 'purchase') {
                this.handlePurchaseAction();
            } else if (['more_info', 'other_concerns'].includes(option.id)) {
                this.handleSecondaryChoice(option.id);
            } else {
                this.handleUserChoice(option.id);
            }
        }, 500);
    }
    
    handleUserChoice(choiceId) {
        this.selectedConcern = choiceId;
        this.updateProgress();

        switch (choiceId) {
            case 'coverage':
                this.addMessage('シミ・毛穴が隠れないお悩みなんですね。');
                setTimeout(() => {
                    this.addMessage('パーフェクトワンなら高いカバー力で気になる部分をカバー✨');
                    setTimeout(() => {
                        this.addMessage('厚塗り感なく自然に隠せますよ！');
                        setTimeout(() => {
                            this.showSpecialOffer();
                        }, 1000);
                    }, 800);
                }, 1000);
                return;

            case 'texture':
                this.addMessage('厚塗り感・ツヤのなさにお悩みなんですね。');
                setTimeout(() => {
                    this.addMessage('65種の保湿成分配合で上品なツヤ肌を実現👍');
                    setTimeout(() => {
                        this.addMessage('理想のツヤ肌が手に入ります！');
                        setTimeout(() => {
                            this.showSpecialOffer();
                        }, 1000);
                    }, 800);
                }, 1000);
                return;

            case 'lasting':
                this.addMessage('夕方のメイク崩れにお悩みなんですね。');
                setTimeout(() => {
                    this.addMessage('肌への密着力が高いので、夕方までキレイな仕上がりが続きます！🌸');
                    setTimeout(() => {
                        this.showSpecialOffer();
                    }, 1200);
                }, 1000);
                return;
        }
    }
    
    showSecondaryOptions() {
        this.showOptions([
            { id: 'more_info', text: 'もっと詳しく知りたい' },
            { id: 'other_concerns', text: '他の悩みも相談したい' }
        ]);
    }
    
    showSpecialOffer() {
        this.addMessage('そんなあなたに朗報です！🎉');

        setTimeout(() => {
            this.addMessage('今なら特別キャンペーン中です！');
            setTimeout(() => {
                // 画像を表示
                const imageDiv = document.createElement('div');
                imageDiv.className = 'message bot';
                const imageContent = document.createElement('div');
                imageContent.className = 'message-content';
                const img = document.createElement('img');
                img.src = 'perfectone-chat-promo.png';
                img.alt = 'パーフェクトワン定期便特別価格2,640円';
                img.style.width = '100%';
                img.style.borderRadius = '8px';
                img.style.cursor = 'pointer';
                img.addEventListener('click', () => this.redirectToPurchase());
                imageContent.appendChild(img);
                imageDiv.appendChild(imageContent);
                this.messagesContainer.appendChild(imageDiv);
                this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;

                setTimeout(() => {
                    this.addMessage('初回特別価格、2,640円でお試しできます！💰');
                    setTimeout(() => {
                        this.showFinalOptions();
                    }, 1200);
                }, 1000);
            }, 1000);
        }, 1000);
    }
    
    showFinalOptions() {
        this.showOptions([
            { id: 'purchase', text: '今すぐ2,640円で試す！', isCTA: true },
            { id: 'more_info', text: 'もう少し詳しく' },
            { id: 'other_concerns', text: '他の悩みも' }
        ]);
    }
    
    showPriceOffer() {
        this.addMessage('今なら初回特別価格2,640円（税込・送料無料）！');

        setTimeout(() => {
            this.addMessage('定期回数のお約束なしでお試しいただけます✨');
            setTimeout(() => {
                this.showOptions([
                    { id: 'purchase', text: '今すぐ2,640円で試す！', isCTA: true }
                ]);
            }, 1000);
        }, 1000);
    }
    
    resetToInitialOptions() {
        this.showOptions([
            { id: 'coverage', text: 'シミ・毛穴が隠れない' },
            { id: 'texture', text: '厚塗り感・ツヤのなさ' },
            { id: 'lasting', text: '夕方のメイク崩れ' }
        ]);
    }
    
    handlePurchaseAction() {
        setTimeout(() => {
            this.addMessage('素晴らしい判断ですね！🎉');
            setTimeout(() => {
                this.addMessage('お得な定期コースページにご案内いたします...');
                
                // 購入ページへのリンクボタンも表示
                const linkDiv = document.createElement('div');
                linkDiv.className = 'message bot';
                const linkContent = document.createElement('div');
                linkContent.className = 'message-content';
                const linkButton = document.createElement('a');
                linkButton.href = 'https://www.shinnihonseiyaku.co.jp/lp/promotion/cosme/2375b_19/';
                linkButton.target = '_blank';
                linkButton.rel = 'noopener noreferrer';
                linkButton.style.cssText = `
                    display: inline-block;
                    background: linear-gradient(145deg, #DAA520 0%, #FFD700 50%, #DAA520 100%);
                    color: #5a4037;
                    padding: 12px 24px;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: bold;
                    font-size: 16px;
                    margin: 10px 0;
                    transition: transform 0.2s ease;
                `;
                linkButton.textContent = '🛒 今すぐ購入ページへ';
                linkButton.addEventListener('mouseenter', () => {
                    linkButton.style.transform = 'translateY(-2px)';
                });
                linkButton.addEventListener('mouseleave', () => {
                    linkButton.style.transform = 'translateY(0)';
                });
                
                linkContent.appendChild(linkButton);
                linkDiv.appendChild(linkContent);
                this.messagesContainer.appendChild(linkDiv);
                
                setTimeout(() => {
                    this.messagesContainer.scrollTo({
                        top: this.messagesContainer.scrollHeight,
                        behavior: 'smooth'
                    });
                }, 100);
                
                setTimeout(() => {
                    this.redirectToPurchase();
                }, 1500);
            }, 800);
        }, 300);
    }
    
    redirectToPurchase() {
        const lpUrl = 'https://www.shinnihonseiyaku.co.jp/lp/promotion/cosme/2375b_19/';

        // ポップアップブロッカー対策として複数の方法を試行
        try {
            const newWindow = window.open(lpUrl, '_blank', 'noopener,noreferrer');
            if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
                // ポップアップがブロックされた場合、同じタブで開く
                window.location.href = lpUrl;
            }
        } catch (e) {
            // エラーの場合は同じタブで開く
            window.location.href = lpUrl;
        }
    }
    
    handleSecondaryChoice(choiceId) {
        switch (choiceId) {
            case 'more_info':
                setTimeout(() => {
                    this.addMessage('パーフェクトワンの詳細をご説明しますね！📋');
                    setTimeout(() => {
                        this.addMessage('✅ 9年連続国内売上No.1のブランド発\n✅ カバー力とツヤ感を両立\n✅ 定期回数のお約束なし');
                        setTimeout(() => {
                            this.addMessage('安心してお試しいただけます！');
                            setTimeout(() => {
                                this.showOptions([
                                    { id: 'purchase', text: '今すぐ2,640円で試す！', isCTA: true },
                                    { id: 'other_concerns', text: '他の悩みも' }
                                ]);
                            }, 1000);
                        }, 1500);
                    }, 1000);
                }, 300);
                break;
                
            case 'other_concerns':
                setTimeout(() => {
                    this.addMessage('他にもお悩みがあるのですね😊');
                    setTimeout(() => {
                        this.addMessage('パーフェクトワンは複数のお悩みに同時にアプローチできます！');
                        setTimeout(() => {
                            this.addMessage('どちらが一番気になりますか？');
                            setTimeout(() => {
                                this.resetToInitialOptions();
                            }, 800);
                        }, 800);
                    }, 1000);
                }, 300);
                break;
                
            case 'purchase':
                this.handlePurchaseAction();
                break;
        }
    }
}

// パーティクルアニメーション
class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.init();
    }
    
    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1';
        this.canvas.style.opacity = '0.6';
        document.body.appendChild(this.canvas);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        // パーティクル数を50から20に削減してパフォーマンス改善
        const particleCount = window.innerWidth < 768 ? 10 : 20;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.2,
                color: `hsl(${45 + Math.random() * 15}, 70%, 60%)`
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// スクロールアニメーション
class ScrollAnimations {
    constructor() {
        this.init();
    }
    
    init() {
        this.observeElements();
        this.initCounterAnimation();
    }
    
    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // アニメーション対象要素を監視
        document.querySelectorAll('.hero h2, .hero p, .features h3, .tab-button, .benefits-section h3, .concern-illustration, .solution-illustration, .scientific-evidence, .cta-section h3').forEach(el => {
            observer.observe(el);
        });
    }
    
    initCounterAnimation() {
        const counterElements = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        counterElements.forEach(el => {
            counterObserver.observe(el);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 2000;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentValue = Math.floor(progress * target);
            element.textContent = currentValue + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + '%';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// インタラクティブタブシステム
class InteractiveFeatures {
    constructor() {
        this.init();
    }
    
    init() {
        this.initTabs();
        this.initProgressRings();
    }
    
    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.dataset.tab;
                
                // Remove active class from all buttons and panels
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanels.forEach(panel => panel.classList.remove('active'));
                
                // Add active class to clicked button and corresponding panel
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Restart animations for the active panel
                this.animateActiveTab(targetTab);
            });
        });
    }
    
    animateActiveTab(tabId) {
        const activePanel = document.getElementById(tabId);
        const benefitItems = activePanel.querySelectorAll('.benefit-item');
        
        // Reset and restart benefit item animations
        benefitItems.forEach((item, index) => {
            item.style.animation = 'none';
            item.offsetHeight; // Trigger reflow
            item.style.animation = `fadeInLeft 0.6s ease-out ${index * 0.1}s both`;
        });
        
        // Animate progress ring if present
        const progressCircle = activePanel.querySelector('.progress-circle');
        if (progressCircle) {
            progressCircle.style.animation = 'none';
            progressCircle.offsetHeight; // Trigger reflow
            progressCircle.style.animation = 'progressAnimation 2s ease-in-out';
        }
        
        // Animate counter if present
        const counterElement = activePanel.querySelector('[data-counter]');
        if (counterElement) {
            this.animateCounter(counterElement);
        }
    }
    
    initProgressRings() {
        const progressCircles = document.querySelectorAll('.progress-circle');
        progressCircles.forEach(circle => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        circle.style.animation = 'progressAnimation 2s ease-in-out';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(circle);
        });
    }
    
    animateCounter(element) {
        const target = parseInt(element.dataset.counter);
        const duration = 1500;
        const start = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentValue = Math.floor(easeOutQuart * target);
            
            element.textContent = currentValue + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target + '%';
            }
        };
        
        requestAnimationFrame(animate);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const chatbot = new PerfectOneChatbot();

    // パーティクルシステム削除（パフォーマンス改善のため）
    // new ParticleSystem();

    // スクロールアニメーション初期化
    new ScrollAnimations();

    // インタラクティブ機能初期化
    new InteractiveFeatures();

    // 要素をキャッシュ（DOM検索を1回だけ実行）
    const scrollProgress = document.getElementById('scroll-progress-bar');
    const stickyCta = document.getElementById('sticky-cta');
    const ctaSection = document.querySelector('.cta-section');
    const heroHeader = document.querySelector('.hero-header');

    // オフセットを事前計算
    let heroHeight = heroHeader ? heroHeader.offsetHeight : 0;
    let ctaSectionTop = ctaSection ? ctaSection.offsetTop : 0;

    // リサイズ時にオフセットを再計算
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            heroHeight = heroHeader ? heroHeader.offsetHeight : 0;
            ctaSectionTop = ctaSection ? ctaSection.offsetTop : 0;
        }, 250);
    });

    // シンプルなスクロールハンドラー（パララックス削除）
    let ticking = false;

    function updateScrollEffects() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

        // スクロール進捗バー
        if (scrollProgress) {
            const progress = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = progress + '%';
        }

        // スティッキーCTAボタン
        if (stickyCta && ctaSection) {
            const scrollPosition = scrollTop + window.innerHeight;
            if (scrollTop > heroHeight && scrollPosition < ctaSectionTop) {
                stickyCta.classList.remove('sticky-cta-hidden');
                stickyCta.classList.add('sticky-cta-visible');
            } else {
                stickyCta.classList.remove('sticky-cta-visible');
                stickyCta.classList.add('sticky-cta-hidden');
            }
        }

        ticking = false;
    }

    // スクロールイベント（throttle処理）
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }, { passive: true });

    // カウントアップアニメーション
    const countUpElements = document.querySelectorAll('.count-up');
    const countUpObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                const duration = 2000;
                const start = performance.now();

                const animate = (currentTime) => {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    const currentValue = Math.floor(easeOutQuart * target);

                    entry.target.textContent = currentValue.toLocaleString('ja-JP');

                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        entry.target.textContent = target.toLocaleString('ja-JP');
                        entry.target.classList.add('counted');
                    }
                };

                requestAnimationFrame(animate);
            }
        });
    }, { threshold: 0.5 });

    countUpElements.forEach(el => {
        countUpObserver.observe(el);
    });

    // グローバルイベントリスナーは削除（各ボタンに直接イベントを設定）

    // 相談ボタンでチャットボットを開く
    document.getElementById('consultation-trigger').addEventListener('click', function(e) {
        e.preventDefault();
        chatbot.openChat();
        chatbot.showInitialMessage();
    });

    // ヒーローセクションの相談ボタンでチャットボットを開く
    document.getElementById('hero-consultation-trigger').addEventListener('click', function(e) {
        e.preventDefault();
        chatbot.openChat();
        chatbot.showInitialMessage();
    });

    // 購入ページへのリダイレクト関数
    function redirectToPurchasePage() {
        const purchaseUrl = 'https://www.shinnihonseiyaku.co.jp/lp/promotion/cosme/2375b_19/';
        window.open(purchaseUrl, '_blank');
    }

    // ヒーローセクションの定期便画像をクリック可能にする
    const subscriptionImage = document.querySelector('.subscription-offer-image');
    if (subscriptionImage) {
        subscriptionImage.style.cursor = 'pointer';
        subscriptionImage.addEventListener('click', redirectToPurchasePage);
    }

    // 価格セクションの各要素をクリック可能にする
    const priceElements = [
        '.cta-section h3',
        '.price-header',
        '.discount-badge', 
        '.price-main-container',
        '.price-guarantee'
    ];

    priceElements.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', redirectToPurchasePage);
        }
    });

    // 商品ボトル画像をクリック可能にする
    const solutionImage = document.querySelector('.solution-image');
    if (solutionImage) {
        solutionImage.style.cursor = 'pointer';
        solutionImage.addEventListener('click', redirectToPurchasePage);
    }

    // ヒーローセクションの特徴バッジをクリック可能にする
    const featureBadges = document.querySelectorAll('.feature-badge-large');
    featureBadges.forEach(badge => {
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', redirectToPurchasePage);
    });

    // Price Countup Animation
    const priceMain = document.querySelector('.price-main');
    if (priceMain && priceMain.hasAttribute('data-price')) {
        const priceObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    const targetPrice = parseInt(entry.target.getAttribute('data-price'));
                    const duration = 1500;
                    const start = performance.now();

                    const animate = (currentTime) => {
                        const elapsed = currentTime - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentValue = Math.floor(easeOutQuart * targetPrice);

                        entry.target.textContent = currentValue.toLocaleString('ja-JP') + '円';

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            entry.target.textContent = targetPrice.toLocaleString('ja-JP') + '円';
                            entry.target.classList.add('counted');
                        }
                    };

                    requestAnimationFrame(animate);
                }
            });
        }, { threshold: 0.3 });

        priceObserver.observe(priceMain);
    }

    // Scroll-Triggered Animations with Intersection Observer
    const scrollObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, scrollObserverOptions);

    // Observe all elements that need scroll-triggered animations
    const animateOnScroll = [
        '.concern-image',
        '.solution-image',
        '.subscription-offer-image',
        '.benefit-item',
        '.concern-item',
        '.solution-item',
        '.features h3',
        '.benefits-section h3',
        '.cta-section h3',
        '.evidence-item',
        '.transform-arrow'
    ];

    animateOnScroll.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            scrollObserver.observe(el);
        });
    });

    // チャットボット吹き出しのセリフローテーション
    new ChatbotCalloutManager();
});

// チャットボット吹き出しのセリフローテーション管理
class ChatbotCalloutManager {
    constructor() {
        this.calloutElement = document.querySelector('.chatbot-callout');
        this.messages = [
            '相談してください！',
            'お悩み解決します✨',
            '気軽にどうぞ♪',
            '無料で診断できます',
            'まずはチャットで相談',
            '今なら特別価格！'
        ];
        this.currentIndex = 0;
        this.interval = 4000; // 4秒ごとに切り替え
        this.fadeOutDuration = 500;
        this.fadeInDuration = 500;

        if (this.calloutElement) {
            this.start();
        }
    }

    start() {
        // 初期表示後、定期的にセリフを切り替え
        setTimeout(() => {
            this.rotateMessage();
        }, 3000); // 最初は3秒後に開始
    }

    rotateMessage() {
        // フェードアウト
        this.calloutElement.style.animation = 'calloutFadeOut 0.5s ease-out forwards';

        setTimeout(() => {
            // セリフを変更
            this.currentIndex = (this.currentIndex + 1) % this.messages.length;
            this.calloutElement.textContent = this.messages[this.currentIndex];

            // フェードイン
            this.calloutElement.style.animation = 'calloutFadeIn 0.5s ease-in forwards, calloutBounce 2.5s ease-in-out infinite, calloutShine 3s ease-in-out infinite';

            // 次のローテーション
            setTimeout(() => {
                this.rotateMessage();
            }, this.interval);
        }, this.fadeOutDuration);
    }
}