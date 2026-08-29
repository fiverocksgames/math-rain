const SUPPORTED_LANGUAGES = ['ko', 'en'];
const LANGUAGE_STORAGE_KEY = 'math-rain.language';

const COPY = {
    ko: {
        language: '언어',
        subtitle: '수학 문제 빗방울 게임',
        levelLabel: '레벨 선택',
        operationLabel: '연산 선택',
        difficultyLabel: '난이도',
        digitLabel: '자릿수 선택',
        operations: { add: '➕ 덧셈', sub: '➖ 뺄셈', mul: '✖️ 곱셈', div: '➗ 나눗셈', mixed: '🔀 혼합' },
        difficulties: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
        digits: { '1': '1자리 + 1자리', '2': '2자리 + 1자리', '3': '2자리 + 2자리' },
        start: '게임 시작',
        sharePage: '🔗 페이지 공유',
        gameHub: '🎮 Game Hub',
        gameLabels: { difficulty: '난이도', level: '레벨', score: '점수', progress: '진행' },
        menu: '메뉴로',
        restart: '다시 시작',
        resultLabels: { score: '최종 점수', level: '도달 레벨', accuracy: '정확도' },
        nextLevel: '다음 레벨',
        sameLevel: '같은 레벨',
        shareResult: '📤 결과 공유',
        levelClear: '🎉 레벨 클리어!',
        gameOver: '💔 게임 오버',
        levelInfo: (level, count) => `레벨 ${level}: 동시 빗방울 ${count}개`,
        pageShareText: 'Math Rain에서 빠르게 계산해 보세요! 🌧️',
        resultShareText: (score, level, accuracy) => `Math Rain 결과 🌧️\n점수 ${score} · 레벨 ${level} · 정확도 ${accuracy}%`,
        copied: '링크를 클립보드에 복사했어요.',
        shareFailed: '공유하지 못했습니다. 다시 시도해 주세요.'
    },
    en: {
        language: 'Language',
        subtitle: 'Catch the answers before the math rain falls',
        levelLabel: 'Level',
        operationLabel: 'Operation',
        difficultyLabel: 'Difficulty',
        digitLabel: 'Number size',
        operations: { add: '➕ Addition', sub: '➖ Subtraction', mul: '✖️ Multiplication', div: '➗ Division', mixed: '🔀 Mixed' },
        difficulties: { easy: 'Easy', normal: 'Normal', hard: 'Hard' },
        digits: { '1': '1-digit + 1-digit', '2': '2-digit + 1-digit', '3': '2-digit + 2-digit' },
        start: 'Start Game',
        sharePage: '🔗 Share Page',
        gameHub: '🎮 Game Hub',
        gameLabels: { difficulty: 'Difficulty', level: 'Level', score: 'Score', progress: 'Progress' },
        menu: 'Menu',
        restart: 'Restart',
        resultLabels: { score: 'Final Score', level: 'Level Reached', accuracy: 'Accuracy' },
        nextLevel: 'Next Level',
        sameLevel: 'Same Level',
        shareResult: '📤 Share Result',
        levelClear: '🎉 Level Clear!',
        gameOver: '💔 Game Over',
        levelInfo: (level, count) => `Level ${level}: ${count} simultaneous raindrops`,
        pageShareText: 'Try Math Rain and solve the falling math problems! 🌧️',
        resultShareText: (score, level, accuracy) => `Math Rain result 🌧️\nScore ${score} · Level ${level} · Accuracy ${accuracy}%`,
        copied: 'Link copied to the clipboard.',
        shareFailed: 'Could not share. Please try again.'
    }
};

const initialLanguage = () => {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(saved)) return saved;
    return navigator.language.toLowerCase().startsWith('ko') ? 'ko' : 'en';
};

const releaseMetadata = window.__MATH_RAIN_RELEASE__;
const buildLabel = releaseMetadata && releaseMetadata.version && releaseMetadata.sourceSha
    ? `${releaseMetadata.version} · ${releaseMetadata.sourceSha.slice(0, 7)}`
    : releaseMetadata && releaseMetadata.sourceSha
        ? `Build ${releaseMetadata.sourceSha.slice(0, 7)}`
        : 'Build local';

/**
 * Math Rain - App Controller
 * Manages UI, animations, and user interactions
 */

class MathRainApp {
    constructor() {
        this.game = null;
        this.animationFrame = null;
        this.lastTime = 0;

        // DOM elements
        this.screens = {
            setup: document.getElementById('setup-screen'),
            game: document.getElementById('game-screen'),
            result: document.getElementById('result-screen')
        };

        this.elements = {
            // Setup
            levelBtns: document.querySelectorAll('.level-btn'),
            operationBtns: document.querySelectorAll('#operation-select .btn-option'),
            difficultyBtns: document.querySelectorAll('#difficulty-select .btn-option'),
            digitBtns: document.querySelectorAll('#digit-select .btn-option'),
            startBtn: document.getElementById('start-game'),
            levelInfo: document.getElementById('level-info'),
            subtitle: document.getElementById('subtitle'),
            levelLabel: document.getElementById('level-label'),
            operationLabel: document.getElementById('operation-label'),
            difficultyLabel: document.getElementById('difficulty-label'),
            digitLabel: document.getElementById('digit-label'),
            languageTrigger: document.getElementById('language-trigger'),
            languageMenu: document.getElementById('language-menu'),
            languageOptions: document.querySelectorAll('[data-language]'),
            sharePageBtn: document.getElementById('share-page'),
            sharePageStatus: document.getElementById('share-page-status'),
            gameHubLink: document.querySelector('.game-hub-link'),
            buildLabel: document.getElementById('build-label'),

            // Game
            difficultyDisplay: document.getElementById('difficulty-display'),
            levelDisplay: document.getElementById('level-display'),
            livesDisplay: document.getElementById('lives-display'),
            scoreDisplay: document.getElementById('score-display'),
            progressDisplay: document.getElementById('progress-display'),
            gameBoard: document.getElementById('game-board'),
            cardsContainer: document.getElementById('cards-container'),
            backToMenuBtn: document.getElementById('back-to-menu'),
            restartBtn: document.getElementById('restart-game'),
            gameDifficultyLabel: document.getElementById('game-difficulty-label'),
            gameLevelLabel: document.getElementById('game-level-label'),
            gameScoreLabel: document.getElementById('game-score-label'),
            gameProgressLabel: document.getElementById('game-progress-label'),

            // Result
            resultTitle: document.getElementById('result-title'),
            finalScore: document.getElementById('final-score'),
            finalLevel: document.getElementById('final-level'),
            accuracy: document.getElementById('accuracy'),
            nextLevelBtn: document.getElementById('next-level'),
            playAgainBtn: document.getElementById('play-again'),
            backToMenuResultBtn: document.getElementById('back-to-menu-result'),
            shareResultBtn: document.getElementById('share-result'),
            shareResultStatus: document.getElementById('share-result-status'),
            finalScoreLabel: document.getElementById('final-score-label'),
            finalLevelLabel: document.getElementById('final-level-label'),
            accuracyLabel: document.getElementById('accuracy-label')
        };

        // Selected options
        this.selectedLevel = 3;
        this.selectedOperation = 'mixed';
        this.selectedDifficulty = 'normal';
        this.selectedDigits = '1';
        this.language = initialLanguage();
        this.currentResult = null;

        this.init();
    }

    /**
     * Initialize the app
     */
    init() {
        this.setupEventListeners();
        this.applyLanguage();
        this.elements.buildLabel.textContent = buildLabel;
        this.showScreen('setup');
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Level selection
        this.elements.levelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.levelBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedLevel = parseInt(btn.dataset.level);
                this.updateLevelInfo();
            });
        });

        // Operation selection
        this.elements.operationBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.operationBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedOperation = btn.dataset.value;
            });
        });

        // Difficulty selection
        this.elements.difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.difficultyBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedDifficulty = btn.dataset.value;
            });
        });

        // Digit selection
        this.elements.digitBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.digitBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedDigits = btn.dataset.value;
            });
        });

        // Language selection
        this.elements.languageTrigger.addEventListener('click', () => {
            const willOpen = this.elements.languageMenu.hidden;
            this.elements.languageMenu.hidden = !willOpen;
            this.elements.languageTrigger.setAttribute('aria-expanded', String(willOpen));
        });

        this.elements.languageOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                this.language = btn.dataset.language;
                window.localStorage.setItem(LANGUAGE_STORAGE_KEY, this.language);
                this.elements.languageMenu.hidden = true;
                this.elements.languageTrigger.setAttribute('aria-expanded', 'false');
                this.applyLanguage();
            });
        });

        // Sharing
        this.elements.sharePageBtn.addEventListener('click', () => this.sharePage());
        this.elements.shareResultBtn.addEventListener('click', () => this.shareResult());

        // Start game
        this.elements.startBtn.addEventListener('click', () => {
            this.startGame();
        });

        // Game controls
        this.elements.backToMenuBtn.addEventListener('click', () => {
            this.showScreen('setup');
        });

        this.elements.restartBtn.addEventListener('click', () => {
            this.startGame();
        });

        // Result controls
        this.elements.nextLevelBtn.addEventListener('click', () => {
            this.selectedLevel++;
            this.updateLevelSelection();
            this.startGame();
        });

        this.elements.playAgainBtn.addEventListener('click', () => {
            this.startGame();
        });

        this.elements.backToMenuResultBtn.addEventListener('click', () => {
            this.showScreen('setup');
        });
    }

    /**
     * Update level info text
     */
    updateLevelInfo() {
        const numRaindrops = Math.min(this.selectedLevel, 6);
        this.elements.levelInfo.textContent = COPY[this.language].levelInfo(this.selectedLevel, numRaindrops);
    }

    /**
     * Update level selection UI
     */
    updateLevelSelection() {
        this.elements.levelBtns.forEach(btn => {
            btn.classList.remove('selected');
            if (parseInt(btn.dataset.level) === this.selectedLevel) {
                btn.classList.add('selected');
            }
        });
        this.updateLevelInfo();
    }

    /**
     * Show a specific screen
     */
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    }

    /**
     * Start the game
     */
    startGame() {
        // Stop any existing game and animation first
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        if (this.game) {
            this.game.stop();
        }

        // Clean up
        this.elements.gameBoard.innerHTML = '';
        this.elements.cardsContainer.innerHTML = '';

        // Show game screen
        this.showScreen('game');

        // Create game instance and setup - batched together for speed
        this.game = new MathRainGame({
            level: this.selectedLevel,
            operation: this.selectedOperation,
            difficulty: this.selectedDifficulty,
            digits: this.selectedDigits
        });

        // Setup callbacks
        this.game.onScoreUpdate = (score) => {
            this.elements.scoreDisplay.textContent = score;
        };

        this.game.onLivesUpdate = (lives) => {
            this.elements.livesDisplay.textContent = '❤️'.repeat(lives);
        };

        this.game.onProgressUpdate = (solved, total) => {
            this.elements.progressDisplay.textContent = `${solved}/${total}`;
        };

        this.game.onLevelComplete = (result) => {
            this.showResult(true, result);
        };

        this.game.onGameOver = (result) => {
            this.showResult(false, result);
        };

        this.game.onCardsUpdate = () => {
            this.renderCards();
        };

        // Update display
        this.elements.difficultyDisplay.textContent =
            COPY[this.language].difficulties[this.selectedDifficulty];
        this.elements.levelDisplay.textContent = this.selectedLevel;

        // Start game (generates problems + raindrops + cards)
        this.game.start();
        
        // Force initial positions for raindrops to be top edge
        this.game.getRaindrops().forEach(r => r.y = 0);

        // Render everything immediately
        this.renderCards();
        this.renderRaindrops();

        // Start animation loop
        this.lastTime = performance.now();
        this.animate();
    }

    /**
     * Animation loop
     */
    animate(currentTime = 0) {
        if (!this.game) return;

        // Ensure we don't have a huge jump from 0
        if (this.lastTime === 0 || currentTime < this.lastTime) {
            this.lastTime = currentTime;
        }

        try {
            const deltaTime = Math.min(currentTime - this.lastTime, 100);
            this.lastTime = currentTime;

            // Update and render raindrops
            this.updateRaindrops(deltaTime);
            this.renderRaindrops();

            // Continue animation
            this.animationFrame = requestAnimationFrame((time) => this.animate(time));
        } catch (error) {
            console.error("Animation error:", error);
            // Optionally stop the game on critical error
            this.game.stop();
        }
    }

    /**
     * Update raindrops position
     */
    updateRaindrops(deltaTime) {
        const raindrops = this.game.getRaindrops();
        // Prevent large jumps if the game starts/resumes after a pause
        const safeDeltaTime = Math.min(deltaTime, 50);

        raindrops.forEach(raindrop => {
            // Move raindrop down with constant speed
            const speedPercentPerMs = 100 / this.game.raindropSpeed;
            raindrop.y += speedPercentPerMs * safeDeltaTime;

            // Check if raindrop reached bottom
            if (raindrop.y >= 90) {
                this.game.raindropMissed(raindrop);
            }
        });
    }

    /**
     * Render raindrops to DOM
     */
    renderRaindrops() {
        const raindrops = this.game.getRaindrops();
        const board = this.elements.gameBoard;

        raindrops.forEach(raindrop => {
            if (!raindrop || !raindrop.problem) return;

            // Efficiently find existing element
            let element = board.querySelector(`[data-id="${raindrop.id}"]`);
            
            if (!element) {
                element = document.createElement('div');
                element.className = 'raindrop';
                element.dataset.id = raindrop.id;
                
                const question = raindrop.problem.question;
                const answer = raindrop.problem.answer;
                const text = (question || (answer !== undefined ? answer + ' = ?' : '문제')) + '';
                element.textContent = text;
                
                // Add three raindrop shape overlays
                for (let i = 0; i < 3; i++) {
                    const dropOverlay = document.createElement('div');
                    dropOverlay.className = 'raindrop-shape';
                    // Position them side-by-side
                    dropOverlay.style.left = (25 + (i * 25)) + '%';
                    element.appendChild(dropOverlay);
                }
                
                element.style.position = 'absolute';
                board.appendChild(element);
            }

            // Update position - Ensure units are present
            element.style.left = raindrop.x + '%';
            // Clamp top position to 0% if negative to prevent off-screen rendering
            element.style.top = Math.max(0, raindrop.y) + '%';

            // Apply warning style if close to bottom
            if (raindrop.y >= 70) {
                element.classList.add('warning');
            } else {
                element.classList.remove('warning');
            }
        });

        // Remove elements that are no longer in the raindrops list
        const raindropIds = new Set(raindrops.map(r => r.id.toString()));
        board.querySelectorAll('.raindrop').forEach(el => {
            if (!raindropIds.has(el.dataset.id)) {
                el.remove();
            }
        });
    }

    /**
     * Render answer cards
     */
    renderCards() {
        if (!this.game) return;

        const cards = this.game.getCards();
        this.elements.cardsContainer.innerHTML = '';

        const grid = document.createElement('div');
        grid.className = 'cards-grid';

        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (card.used) {
                cardElement.classList.add('used');
            }
            cardElement.textContent = card.value;
            cardElement.dataset.value = card.value;

            cardElement.addEventListener('click', () => {
                if (!card.used) {
                    this.handleCardClick(card.value, cardElement);
                }
            });

            grid.appendChild(cardElement);
        });

        this.elements.cardsContainer.appendChild(grid);
    }

    /**
     * Handle card click
     */
    handleCardClick(value, element) {
        const result = this.game.selectCard(value);

        if (result) {
            element.classList.add('correct');
            element.classList.add('used');

            setTimeout(() => {
                this.renderCards();
            }, 300);
        } else {
            element.classList.add('wrong');
            setTimeout(() => {
                element.classList.remove('wrong');
            }, 500);
        }
    }

    /**
     * Show result screen
     */
    showResult(success, result) {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        const copy = COPY[this.language];
        if (success) {
            this.elements.resultTitle.textContent = copy.levelClear;
            this.elements.nextLevelBtn.style.display = 'block';
        } else {
            this.elements.resultTitle.textContent = copy.gameOver;
            this.elements.nextLevelBtn.style.display = 'none';
        }

        const accuracy = result.accuracy || 0;
        this.currentResult = { score: result.score, level: result.level, accuracy };
        this.elements.finalScore.textContent = result.score;
        this.elements.finalLevel.textContent = result.level;
        this.elements.accuracy.textContent = accuracy + '%';
        this.elements.shareResultStatus.textContent = '';

        this.showScreen('result');
    }

    applyLanguage() {
        const copy = COPY[this.language];
        document.documentElement.lang = this.language;
        this.elements.subtitle.textContent = copy.subtitle;
        this.elements.levelLabel.textContent = copy.levelLabel;
        this.elements.operationLabel.textContent = copy.operationLabel;
        this.elements.difficultyLabel.textContent = copy.difficultyLabel;
        this.elements.digitLabel.textContent = copy.digitLabel;
        this.elements.startBtn.textContent = copy.start;
        this.elements.sharePageBtn.textContent = copy.sharePage;
        this.elements.gameHubLink.textContent = copy.gameHub;
        this.elements.languageTrigger.setAttribute('aria-label', copy.language);
        this.elements.languageMenu.setAttribute('aria-label', copy.language);

        this.elements.operationBtns.forEach(btn => {
            btn.textContent = copy.operations[btn.dataset.value];
        });
        this.elements.difficultyBtns.forEach(btn => {
            btn.textContent = copy.difficulties[btn.dataset.value];
        });
        this.elements.digitBtns.forEach(btn => {
            btn.textContent = copy.digits[btn.dataset.value];
        });

        this.elements.gameDifficultyLabel.textContent = copy.gameLabels.difficulty;
        this.elements.gameLevelLabel.textContent = copy.gameLabels.level;
        this.elements.gameScoreLabel.textContent = copy.gameLabels.score;
        this.elements.gameProgressLabel.textContent = copy.gameLabels.progress;
        this.elements.backToMenuBtn.textContent = copy.menu;
        this.elements.restartBtn.textContent = copy.restart;

        this.elements.finalScoreLabel.textContent = copy.resultLabels.score;
        this.elements.finalLevelLabel.textContent = copy.resultLabels.level;
        this.elements.accuracyLabel.textContent = copy.resultLabels.accuracy;
        this.elements.nextLevelBtn.textContent = copy.nextLevel;
        this.elements.playAgainBtn.textContent = copy.sameLevel;
        this.elements.backToMenuResultBtn.textContent = copy.menu;
        this.elements.shareResultBtn.textContent = copy.shareResult;

        this.elements.languageOptions.forEach(btn => {
            const active = btn.dataset.language === this.language;
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-selected', String(active));
        });
        this.elements.languageTrigger.textContent = this.language === 'ko' ? '🇰🇷' : '🇺🇸';

        this.updateLevelInfo();
        if (this.game) {
            this.elements.difficultyDisplay.textContent = copy.difficulties[this.selectedDifficulty];
        }
        if (this.currentResult) {
            this.elements.resultTitle.textContent =
                this.elements.nextLevelBtn.style.display === 'none' ? copy.gameOver : copy.levelClear;
        }
    }

    async sharePage() {
        const copy = COPY[this.language];
        await this.share({
            title: 'Math Rain',
            text: copy.pageShareText,
            url: window.location.href
        }, this.elements.sharePageStatus);
    }

    async shareResult() {
        if (!this.currentResult) return;
        const copy = COPY[this.language];
        const { score, level, accuracy } = this.currentResult;
        await this.share({
            title: 'Math Rain',
            text: copy.resultShareText(score, level, accuracy),
            url: window.location.href
        }, this.elements.shareResultStatus);
    }

    async share(data, statusElement) {
        const copy = COPY[this.language];
        statusElement.textContent = '';

        try {
            if (navigator.share) {
                await navigator.share(data);
                return;
            }

            const shareText = `${data.text}\n${data.url}`;
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shareText);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = shareText;
                textarea.setAttribute('readonly', '');
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const copied = document.execCommand('copy');
                textarea.remove();
                if (!copied) throw new Error('Clipboard copy failed');
            }
            statusElement.textContent = copy.copied;
        } catch (error) {
            if (error && error.name === 'AbortError') return;
            console.error('Share failed:', error);
            statusElement.textContent = copy.shareFailed;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MathRainApp();
});