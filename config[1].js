export const config = {
    // Water Usage Game
    initialWaterUsage: 75, 
    maxWaterUsage: 100, 
    minWaterUsage: 0, 
    waterReduction: 5, 
    waterIncrease: 2, 
    updateInterval: 1000, 
    scoreMultiplier: 10, 
    targetUsage: 30,

    // Rain Catcher Game
    rainDropSpeed: 4,
    rainSpawnRate: 800,
    bucketSpeed: 6,
    rainPoints: 10,
    rainDropSize: 4,
    bucketWidth: 60,
    bucketHeight: 40,
    maxRaindrops: 15,
    gameTime: 60000, 

    // Quiz Game
    quizTime: 30,
    correctAnswerPoints: 10,
    questionTimeout: 15000,  

    // Additional game settings
    dropletAnimationSpeed: 2,
    dropletSize: 15,
    dropletColor: '#2196f3',
    
    // Visual feedback settings
    successColor: '#4caf50',
    warningColor: '#ffa726',
    errorColor: '#ff4444',
    
    // Achievement thresholds
    achievements: {
        waterSaver: 500,
        rainMaster: 1000,
        quizGenius: 40
    }
};

export const waterFacts = [
    "Um vazamento de uma gota por segundo desperdiça 4,5 litros de água por dia",
    "Uma descarga antiga gasta até 18 litros de água por vez",
    "Lavar o carro com mangueira gasta 560 litros de água",
    "Uma torneira aberta por 5 minutos gasta 80 litros de água",
    "Um banho de 15 minutos consome cerca de 135 litros de água"
];

export const quizQuestions = [
    {
        question: "Qual porcentagem da Terra é coberta por água?",
        options: ["50%", "60%", "70%", "80%"],
        correct: 2
    },
    {
        question: "Quanto tempo em média uma pessoa pode ficar sem água?",
        options: ["1 dia", "3 dias", "7 dias", "15 dias"],
        correct: 1
    },
    {
        question: "Quanto do corpo humano é composto por água?",
        options: ["50%", "60%", "70%", "80%"],
        correct: 2
    },
    {
        question: "Qual é o oceano mais profundo do mundo?",
        options: ["Atlântico", "Índico", "Pacífico", "Ártico"],
        correct: 2
    },
    {
        question: "Qual é a principal causa do desperdício de água nas residências?",
        options: ["Banhos longos", "Vazamentos", "Lavar louça", "Descarga do banheiro"],
        correct: 1
    }
];