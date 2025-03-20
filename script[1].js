import { config, waterFacts, quizQuestions } from './config.js';

// Game management
const games = {
    waterUsage: document.getElementById('water-usage-game'),
    rainCatcher: document.getElementById('rain-catcher-game'),
    quiz: document.getElementById('water-quiz-game')
};

function switchGame(gameId) {
    Object.values(games).forEach(game => game.classList.remove('active'));
    document.querySelectorAll('.game-button').forEach(btn => btn.classList.remove('active'));
    
    games[gameId].classList.add('active');
    document.querySelector(`[data-game="${gameId}"]`).classList.add('active');
    
    if (gameId === 'rainCatcher') {
        startRainGame();
    } else if (gameId === 'quiz') {
        startQuizGame();
    }
}

// Original Water Usage Game Code
let waterUsage = config.initialWaterUsage;
let score = 0;
let gameActive = true;

function updateWaterGauge() {
    const gauge = document.getElementById('water-gauge');
    const percentage = (waterUsage / config.maxWaterUsage) * 100;
    const color = percentage > 70 ? '#ff4444' : percentage > 40 ? '#ffa726' : '#2196f3';
    
    gauge.innerHTML = `
        <svg viewBox="0 0 100 100">
            <path d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
                stroke="#eee"
                stroke-width="10"
                fill-opacity="0"></path>
            <path d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
                stroke="${color}"
                stroke-width="10"
                fill-opacity="0"
                style="stroke-dasharray: ${percentage * 2.83}, 283"></path>
            <text x="50" y="45" text-anchor="middle" font-size="20">
                ${Math.round(percentage)}%
            </text>
            <text x="50" y="65" text-anchor="middle" font-size="12">
                Score: ${score}
            </text>
        </svg>
    `;

    // Atualiza o status
    const statusElement = document.getElementById('game-status');
    if (percentage <= config.targetUsage) {
        statusElement.textContent = "Parabéns! Você está economizando água!";
        statusElement.className = 'status-good';
    } else if (percentage > 70) {
        statusElement.textContent = "Cuidado! Consumo muito alto!";
        statusElement.className = 'status-bad';
    } else {
        statusElement.textContent = "Continue reduzindo o consumo!";
        statusElement.className = 'status-warning';
    }
    
    const achievements = {
        checkAndAward(type, score) {
            const threshold = config.achievements[type];
            if (score >= threshold && !localStorage.getItem(`achievement_${type}`)) {
                this.showAchievement(type);
                localStorage.setItem(`achievement_${type}`, 'true');
            }
        },

        showAchievement(type) {
            const popup = document.createElement('div');
            popup.className = 'achievement-popup';
            popup.innerHTML = ` Conquista Desbloqueada: ${this.getAchievementName(type)}!`;
            document.body.appendChild(popup);
            
            setTimeout(() => popup.remove(), 3000);
        },

        getAchievementName(type) {
            const names = {
                waterSaver: 'Mestre da Economia',
                rainMaster: 'Coletor Supremo',
                quizGenius: 'Gênio da Água'
            };
            return names[type];
        }
    };
    achievements.checkAndAward('waterSaver', score);
}

function increaseWaterUsage() {
    if (!gameActive) return;
    
    waterUsage = Math.min(waterUsage + config.waterIncrease, config.maxWaterUsage);
    if (waterUsage >= config.maxWaterUsage) {
        gameOver(false);
    }
    updateWaterGauge();
}

function gameOver(won) {
    gameActive = false;
    const message = won ? 
        `Parabéns! Você venceu com ${score} pontos!` : 
        `Fim de jogo! Sua pontuação: ${score}`;
    
    document.getElementById('game-status').textContent = message;
    document.getElementById('restart-game').style.display = 'block';
}

document.getElementById('save-water').addEventListener('click', () => {
    if (!gameActive) return;
    
    if (waterUsage > config.minWaterUsage) {
        waterUsage -= config.waterReduction;
        score += config.scoreMultiplier;
        
        // Efeito visual no botão
        const button = document.getElementById('save-water');
        button.classList.add('button-press');
        setTimeout(() => button.classList.remove('button-press'), 200);
        
        if (waterUsage <= config.targetUsage) {
            gameOver(true);
        }
        
        updateWaterGauge();
    }
});

document.getElementById('restart-game').addEventListener('click', () => {
    waterUsage = config.initialWaterUsage;
    score = 0;
    gameActive = true;
    document.getElementById('restart-game').style.display = 'none';
    updateWaterGauge();
});

// Rain Catcher Game
let rainGameActive = false;
let rainCanvas, rainCtx;
let bucket = { x: 0, y: 0, width: 0, height: 0 };
let raindrops = [];
let rainScore = 0;

function startRainGame() {
    rainCanvas = document.getElementById('rain-game-canvas');
    rainCtx = rainCanvas.getContext('2d');
    rainGameActive = true;
    rainScore = 0;
    raindrops = [];
    bucket = {
        x: rainCanvas.width / 2,
        y: rainCanvas.height - config.bucketHeight,
        width: config.bucketWidth,
        height: config.bucketHeight
    };
    
    // Start game timer
    setTimeout(() => {
        endRainGame();
    }, config.gameTime);
    
    document.addEventListener('mousemove', moveBucket);
    requestAnimationFrame(updateRainGame);
    setInterval(createRaindrop, config.rainSpawnRate);
}

function endRainGame() {
    rainGameActive = false;
    rainCtx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);
    
    rainCtx.fillStyle = 'white';
    rainCtx.font = '30px Arial';
    rainCtx.textAlign = 'center';
    rainCtx.fillText(`Fim de Jogo! Pontuação: ${rainScore}`, rainCanvas.width/2, rainCanvas.height/2);
    
    rainCtx.font = '20px Arial';
    rainCtx.fillText('Clique para jogar novamente', rainCanvas.width/2, rainCanvas.height/2 + 40);
    
    rainCanvas.addEventListener('click', startRainGame, { once: true });
    
    const achievements = {
        checkAndAward(type, score) {
            const threshold = config.achievements[type];
            if (score >= threshold && !localStorage.getItem(`achievement_${type}`)) {
                this.showAchievement(type);
                localStorage.setItem(`achievement_${type}`, 'true');
            }
        },

        showAchievement(type) {
            const popup = document.createElement('div');
            popup.className = 'achievement-popup';
            popup.innerHTML = ` Conquista Desbloqueada: ${this.getAchievementName(type)}!`;
            document.body.appendChild(popup);
            
            setTimeout(() => popup.remove(), 3000);
        },

        getAchievementName(type) {
            const names = {
                waterSaver: 'Mestre da Economia',
                rainMaster: 'Coletor Supremo',
                quizGenius: 'Gênio da Água'
            };
            return names[type];
        }
    };
    achievements.checkAndAward('rainMaster', rainScore);
}

function createRaindrop() {
    if (!rainGameActive) return;
    raindrops.push({
        x: Math.random() * rainCanvas.width,
        y: 0
    });
}

function moveBucket(e) {
    const rect = rainCanvas.getBoundingClientRect();
    bucket.x = e.clientX - rect.left - bucket.width / 2;
}

function updateRainGame() {
    if (!rainGameActive) return;
    
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    
    // Draw bucket
    rainCtx.fillStyle = '#2196f3';
    rainCtx.beginPath();
    rainCtx.moveTo(bucket.x, bucket.y + bucket.height);
    rainCtx.lineTo(bucket.x + bucket.width, bucket.y + bucket.height);
    rainCtx.lineTo(bucket.x + bucket.width - 10, bucket.y);
    rainCtx.lineTo(bucket.x + 10, bucket.y);
    rainCtx.closePath();
    rainCtx.fill();
    
    // Update and draw raindrops
    for (let i = raindrops.length - 1; i >= 0; i--) {
        const drop = raindrops[i];
        drop.y += config.rainDropSpeed;
        
        // Draw raindrop
        rainCtx.beginPath();
        rainCtx.moveTo(drop.x, drop.y);
        rainCtx.lineTo(drop.x - 3, drop.y - 8);
        rainCtx.lineTo(drop.x + 3, drop.y - 8);
        rainCtx.closePath();
        rainCtx.fillStyle = '#2196f3';
        rainCtx.fill();
        
        // Check collision with bucket
        if (drop.y > bucket.y && drop.y < bucket.y + bucket.height &&
            drop.x > bucket.x && drop.x < bucket.x + bucket.width) {
            raindrops.splice(i, 1);
            rainScore += config.rainPoints;
            
            // Add splash effect
            createSplashEffect(drop.x, bucket.y);
        }
        
        // Remove drops that fall off screen
        if (drop.y > rainCanvas.height) {
            raindrops.splice(i, 1);
        }
    }
    
    // Draw score
    rainCtx.fillStyle = '#000';
    rainCtx.font = '24px Arial';
    rainCtx.fillText(`Pontuação: ${rainScore}`, 10, 30);
    
    if (rainGameActive) {
        requestAnimationFrame(updateRainGame);
    }
}

function createSplashEffect(x, y) {
    const particles = [];
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x,
            y: y,
            speedX: (Math.random() - 0.5) * 4,
            speedY: -Math.random() * 4,
            life: 20
        });
    }
    
    function updateSplash() {
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.speedX;
            p.y += p.speedY;
            p.speedY += 0.2;
            p.life--;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
            } else {
                rainCtx.beginPath();
                rainCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
                rainCtx.fillStyle = `rgba(33, 150, 243, ${p.life/20})`;
                rainCtx.fill();
            }
        }
        
        if (particles.length > 0) {
            requestAnimationFrame(updateSplash);
        }
    }
    
    updateSplash();
}

// Quiz Game
let currentQuestion = 0;
let quizScore = 0;
let quizTimer;

function startQuizGame() {
    currentQuestion = 0;
    quizScore = 0;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= quizQuestions.length) {
        endQuiz();
        return;
    }
    
    const question = quizQuestions[currentQuestion];
    const quizContainer = document.querySelector('.quiz-container');
    
    quizContainer.innerHTML = `
        <div class="timer">${config.questionTimeout / 1000}</div>
        <h3>${question.question}</h3>
        <div class="quiz-options">
            ${question.options.map((option, index) => `
                <div class="quiz-option" data-index="${index}">${option}</div>
            `).join('')}
        </div>
    `;

    // Add click event listeners to options
    quizContainer.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', () => {
            checkAnswer(parseInt(option.dataset.index));
        });
    });
    
    startQuizTimer();
}

function checkAnswer(answer) {
    clearTimeout(quizTimer);
    const correct = quizQuestions[currentQuestion].correct === answer;
    
    // Visual feedback
    const options = document.querySelectorAll('.quiz-option');
    options.forEach(option => {
        const index = parseInt(option.dataset.index);
        if (index === quizQuestions[currentQuestion].correct) {
            option.style.backgroundColor = '#4caf50';
            option.style.color = 'white';
        } else if (index === answer && !correct) {
            option.style.backgroundColor = '#ff4444';
            option.style.color = 'white';
        }
    });

    if (correct) {
        quizScore += config.correctAnswerPoints;
    }
    
    // Disable clicking during the feedback display
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });

    currentQuestion++;
    setTimeout(() => {
        options.forEach(option => {
            option.style.pointerEvents = '';
            option.style.backgroundColor = '';
            option.style.color = '';
        });
        showQuestion();
    }, 1000);
}

function startQuizTimer() {
    const timerElement = document.querySelector('.timer');
    let timeLeft = config.questionTimeout / 1000;
    
    clearInterval(quizTimer); // Clear any existing timer
    
    const countdown = setInterval(() => {
        timeLeft--;
        if (timerElement) timerElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            currentQuestion++;
            showQuestion();
        }
    }, 1000);
    
    quizTimer = countdown;
}

function endQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    const totalPossibleScore = quizQuestions.length * config.correctAnswerPoints;
    
    quizContainer.innerHTML = `
        <h3>Quiz Completo!</h3>
        <p>Sua pontuação: ${quizScore} de ${totalPossibleScore} pontos possíveis</p>
        <button class="restart-quiz">Jogar Novamente</button>
    `;

    const restartButton = quizContainer.querySelector('.restart-quiz');
    restartButton.addEventListener('click', startQuizGame);
    
    const achievements = {
        checkAndAward(type, score) {
            const threshold = config.achievements[type];
            if (score >= threshold && !localStorage.getItem(`achievement_${type}`)) {
                this.showAchievement(type);
                localStorage.setItem(`achievement_${type}`, 'true');
            }
        },

        showAchievement(type) {
            const popup = document.createElement('div');
            popup.className = 'achievement-popup';
            popup.innerHTML = ` Conquista Desbloqueada: ${this.getAchievementName(type)}!`;
            document.body.appendChild(popup);
            
            setTimeout(() => popup.remove(), 3000);
        },

        getAchievementName(type) {
            const names = {
                waterSaver: 'Mestre da Economia',
                rainMaster: 'Coletor Supremo',
                quizGenius: 'Gênio da Água'
            };
            return names[type];
        }
    };
    achievements.checkAndAward('quizGenius', quizScore);
}

// Event Listeners
document.querySelectorAll('.game-button').forEach(button => {
    button.addEventListener('click', () => switchGame(button.dataset.game));
});

document.addEventListener('DOMContentLoaded', () => {
    switchGame('waterUsage');
    setInterval(increaseWaterUsage, config.updateInterval);
});

// Add water drop effect on click
function createWaterDrop(x, y) {
    const drop = document.createElement('div');
    drop.className = 'water-drop';
    drop.style.left = `${x}px`;
    drop.style.top = `${y}px`;
    document.body.appendChild(drop);
    
    setTimeout(() => drop.remove(), 1000);
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('interactive-tip')) {
        createWaterDrop(e.clientX, e.clientY);
    }
});

// Add random water facts rotation
function rotateWaterFacts() {
    const factContainers = document.querySelectorAll('.fact-card p');
    factContainers.forEach(container => {
        const randomFact = waterFacts[Math.floor(Math.random() * waterFacts.length)];
        container.style.opacity = '0';
        setTimeout(() => {
            container.textContent = randomFact;
            container.style.opacity = '1';
        }, 500);
    });
}

setInterval(rotateWaterFacts, 10000);