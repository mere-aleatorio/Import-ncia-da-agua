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

// Water Usage Game Logic
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
    
    checkAchievements('waterSaver', score);
}

function checkAchievements(type, score) {
    const threshold = config.achievements[type];
    if (score >= threshold && !localStorage.getItem(`achievement_${type}`)) {
        showAchievement(type);
        localStorage.setItem(`achievement_${type}`, 'true');
    }
}

function showAchievement(type) {
    const popup = document.createElement('div');
    popup.className = 'achievement-popup';
    popup.innerHTML = ` Conquista Desbloqueada: ${getAchievementName(type)}!`;
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 3000);
}

function getAchievementName(type) {
    const names = {
        waterSaver: 'Mestre da Economia',
        rainMaster: 'Coletor Supremo',
        quizGenius: 'Gênio da Água'
    };
    return names[type];
}

// Continue com o restante do código...
