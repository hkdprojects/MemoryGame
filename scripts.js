// --- DOM Elements ---
const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const message = document.getElementById('content');
const popupEmoji = document.getElementById('popup-emoji');
const gameBody = document.getElementById('body');
const cover = document.getElementById('cover');
const popupButtons = document.getElementById('popupButtons');
const startButton = document.getElementById('openCovers');
const playButton = document.getElementById('play');
const resumeButtonDiv = document.getElementById('resumeButtonDiv');
const settings = document.getElementById('settings');
const settingsDiv = document.getElementById('settingsDiv');
const SettingsCloseButton = document.getElementById('SettingsCloseButton');
const coverBtnS = document.getElementById('coverBtnS');
const settingsInfo = document.getElementById('settingsInfo');

// --- Game Data & State ---
const baseCardsArray = [
    { name: 'A' },
    { name: 'B' },
    { name: 'C' },
    { name: 'D' },
    { name: 'E' },
    { name: 'F' },
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let movesLeft = 0;
let hintCount = 0;
let isGameWon = false;
let score = 0;

// --- Initialize Game ---
function initializeGame() {
    // Duplicate array and assign unique IDs and status
    cards = [...baseCardsArray, ...baseCardsArray].map((card, index) => ({
        ...card,
        id: index,
        status: 'unmatched'
    }));

    // Fisher-Yates Shuffle
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }

    // Render DOM elements
    if (gameBoard) {
        gameBoard.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card', 'flipped');
            cardElement.dataset.name = card.name;
            cardElement.dataset.index = index;
            cardElement.innerHTML = card.name;
            cardElement.addEventListener('click', flipCard);
            gameBoard.appendChild(cardElement);
        });
    }

    // Reset State Variables
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    isGameWon = false;
    movesLeft = baseCardsArray.length * 2;
    hintCount = 0;
    score = 0;

    // Reset UI & Stats
    enableBtn();
    countMoves(movesLeft);
    updateHint(hintCount);
    displayStats();
}

// --- Card Logic ---
function flipCard() {
    if (lockBoard || this.classList.contains('matched')) return;

    // Allow player to unflip the first card if clicked again
    if (this === firstCard) {
        unflipFirstCard();
        return;
    }

    this.classList.add('unflip');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    movesLeft--;
    countMoves(movesLeft);
    checkForMatch();
}

function unflipFirstCard() {
    if (!firstCard) return;

    firstCard.classList.remove('unflip');
    resetBoard();
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        score += 15;
        disableCards();
    } else {
        score -= 5;
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    firstCard.style.pointerEvents = 'none';
    secondCard.style.pointerEvents = 'none';

    const index1 = parseInt(firstCard.dataset.index, 10);
    const index2 = parseInt(secondCard.dataset.index, 10);

    cards[index1].status = 'matched';
    cards[index2].status = 'matched';

    matches++;
    resetBoard();

    if (matches === baseCardsArray.length) {
        isGameWon = true;
        gameCompleted();
    } else if (movesLeft === 0) {
        gameLost();
    }
}

function unflipCards() {
    lockBoard = true;
    firstCard.classList.add('notMatch');
    secondCard.classList.add('notMatch');

    setTimeout(() => {
        if (firstCard && secondCard) {
            firstCard.classList.remove('unflip', 'notMatch');
            secondCard.classList.remove('unflip', 'notMatch');
        }
        resetBoard();

        if (movesLeft === 0 && !isGameWon) {
            gameLost();
        }
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// --- Hints ---
function updateHint(value) {
    const hintElement = document.getElementById('hintCount');
    if (hintElement) hintElement.innerText = value;
}

function takeHint() {
    if (lockBoard) return;

    // Deselect first card if one is already open
    if (firstCard) {
        firstCard.classList.remove('unflip');
        resetBoard();
    }

    // Find first unmatched card
    const unmatchedCard = cards.find(card => card.status === 'unmatched');
    if (!unmatchedCard) return;

    // Select matching DOM elements
    const matchingCards = document.querySelectorAll(`[data-name="${unmatchedCard.name}"]`);

    matchingCards.forEach(card => card.classList.add('cardsHint'));
    setTimeout(() => {
        matchingCards.forEach(card => card.classList.remove('cardsHint'));
    }, 1000);

    hintCount++;
    updateHint(hintCount);
    score -= 5;
}

// --- Score Calculation ---
function scoreUpdate() {
    let finalScore = score;

    if (hintCount >= 5) {
        finalScore -= 20;
    } else if (hintCount > 3) {
        finalScore -= 10;
    } else if (hintCount > 2) {
        finalScore -= 5;
    } else if (hintCount === 0) {
        finalScore += 10; // Bonus for using zero hints
    }

    if(score <= 0){
        return 0;
    }else{
        return finalScore;
    }
}

// --- Moves & Status ---
function countMoves(value) {
    const countValue = document.getElementById('display-value');
    if (countValue) {
        countValue.innerText = value;
        countValue.style.color = value <= 3 ? '#FF1600' : '#000';
    }
}

// --- Local Storage Player Stats ---
function saveGameStats(finalScore, movesUsed) {
    const scoreKey = 'highScore_default';
    const movesKey = 'lowestMoves_default';

    // Save Highest Score
    const savedHighScore = localStorage.getItem(scoreKey);
    if (!savedHighScore || finalScore > parseInt(savedHighScore, 10)) {
        localStorage.setItem(scoreKey, finalScore);
    }

    // Save Lowest Moves Used
    const savedLowestMoves = localStorage.getItem(movesKey);
    if (!savedLowestMoves || movesUsed < parseInt(savedLowestMoves, 10)) {
        localStorage.setItem(movesKey, movesUsed);
    }

    displayStats();
}

function displayStats() {
    const highScoreElement = document.getElementById('highScore');
    const lowestMovesElement = document.getElementById('lowestMovesValue');

    const savedHighScore = localStorage.getItem('highScore_default');
    const savedLowestMoves = localStorage.getItem('lowestMoves_default');

    if (highScoreElement) {
        highScoreElement.textContent = savedHighScore !== null ? savedHighScore : '0';
    }

    if (lowestMovesElement) {
        lowestMovesElement.textContent = savedLowestMoves !== null ? savedLowestMoves : '--';
    }
}

// --- Game End Controls ---
function gameCompleted() {
    if (message) message.innerHTML = ' You Won!';
    if (popupEmoji) popupEmoji.innerHTML = '🎉';

    const finalScore = scoreUpdate();
    const totalMovesUsed = (baseCardsArray.length * 2) - movesLeft;

    const details = document.createElement('div');
    details.innerHTML = `<p class="popup-details">Total Moves: ${totalMovesUsed}<br>Hints Used: ${hintCount}<br>Final Score: ${finalScore}</p>`;

    // Clear previous details if any
    const oldDetails = message?.querySelector('.popup-details');
    if (oldDetails) oldDetails.remove();
    if (message) message.appendChild(details);

    if (popupButtons) popupButtons.classList.add('won');

    // Save stats and trigger audio/visuals
    saveGameStats(finalScore, totalMovesUsed);
    playWinSound();
    showPopup();

    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    lockBoard = true;
}

function gameLost() {
    if (message) message.innerHTML = 'Game Over!';
    if (popupEmoji) popupEmoji.innerHTML = '😟';

    const finalScore = scoreUpdate();
    const totalMovesUsed = baseCardsArray.length * 2;

    const details = document.createElement('div');
    details.innerHTML = `<p class="popup-details">Total Moves: ${totalMovesUsed}<br>Hints Used: ${hintCount}<br>Final Score: ${finalScore}</p>`;

    const oldDetails = message?.querySelector('.popup-details');
    if (oldDetails) oldDetails.remove();
    if (message) message.appendChild(details);

    playGameOverSound();
    showPopup();
    disableBtn();
}

// --- UI Disabling & Overlay Management ---
function disableBtn() {
    if (pauseButton) pauseButton.style.pointerEvents = 'none';
    if (settings) settings.style.pointerEvents = 'none';

    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => card.style.pointerEvents = 'none');

    if (gameBody) gameBody.style.opacity = '0.5';
    lockBoard = true;
}

function enableBtn() {
    if (pauseButton) pauseButton.style.pointerEvents = 'auto';
    if (settings) settings.style.pointerEvents = 'auto';

    const cardElements = document.querySelectorAll('.card');
    cardElements.forEach(card => {
        if (card.classList.contains('matched')) {
            return;
        } else {
            card.style.pointerEvents = 'auto'
        }

    });

    if (gameBody) gameBody.style.opacity = '1';
    lockBoard = false;
}

function pauseGame() {
    if (popupButtons) popupButtons.classList.remove('won');
    if (message) message.innerHTML = 'Game Paused';
    if (popupEmoji) popupEmoji.innerHTML = '⌛';
    if (resumeButtonDiv) resumeButtonDiv.style.display = '';

    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "27%";

    disableBtn();
}

function playGame() {
    if (message) message.innerHTML = 'Game Starts';
    if (popupEmoji) popupEmoji.innerHTML = '🤩';

    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "-50%";
    enableBtn();
}

function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "27%";
    if (resumeButtonDiv) resumeButtonDiv.style.display = 'none';
    if (popupButtons) popupButtons.classList.add('won');
    disableBtn();
}

function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "-50%";
    if (message) message.innerHTML = 'All the best';
    if (popupEmoji) popupEmoji.innerHTML = '🤩';

    initializeGame();
}

function openGame() {
    hidePopup();
    if (cover) {
        cover.style.transform = 'translateY(-100%)';
    }
}

function closeGame() {
    if (message) message.innerHTML = 'Bye';
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "27%";
    if (cover) cover.style.transform = 'translateY(0)';
    if (pauseButton) changeButtonBackground(pauseButton, 0);
}

function changeButtonBackground(button, option) {
    if (!button) return;
    if (option === 1) {
        button.style.backgroundColor = 'white';
    } else {
        button.style.backgroundColor = '';
    }
}

// --- Event Listeners ---
startButton?.addEventListener('click', openGame);

restartButton?.addEventListener('click', () => {
    changeButtonBackground(pauseButton, 0);
    hidePopup();
});

pauseButton?.addEventListener('click', () => {
    changeButtonBackground(pauseButton, 1);
    pauseGame();
});

playButton?.addEventListener('click', () => {
    changeButtonBackground(pauseButton, 0);
    playGame();
});

settings?.addEventListener('click', () => {
    if (settingsDiv) settingsDiv.style.left = "10%";
    changeButtonBackground(settings, 1);
    disableBtn();
    if (settingsInfo) settingsInfo.innerText = 'Please close Settings before you Play';
});

SettingsCloseButton?.addEventListener('click', () => {
    if (settingsDiv) settingsDiv.style.left = "-80%";
    changeButtonBackground(settings, 0);
    if (coverBtnS && coverBtnS.style.pointerEvents === 'none') {
        coverBtnS.style.pointerEvents = 'auto';
        if (startButton) startButton.style.pointerEvents = 'auto';
    }
    if (settingsInfo) settingsInfo.innerText = '';
    enableBtn();
});

coverBtnS?.addEventListener('click', () => {
    if (settingsDiv) settingsDiv.style.left = "10%";
    coverBtnS.style.pointerEvents = 'none';
    if (startButton) startButton.style.pointerEvents = 'none';
    disableBtn();
    if (settingsInfo) settingsInfo.innerText = 'Please close Settings before you Play';
});

// --- Audio Controls ---
document.addEventListener("DOMContentLoaded", () => {
    const backgroundMusic = document.getElementById("background-music");
    const buttonSound = document.getElementById("button-sound");
    const toggleCheckbox = document.getElementById("music");
    const soundToggleCheckbox = document.getElementById("sound");

    let touchSoundEnabled = true;

    if (backgroundMusic) {
        backgroundMusic.play().catch(() => {
            console.log("Autoplay prevented by browser interaction policy.");
        });
    }

    toggleCheckbox?.addEventListener("change", () => {
        if (!backgroundMusic) return;
        if (toggleCheckbox.checked) {
            backgroundMusic.play();
        } else {
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;
        }
    });

    soundToggleCheckbox?.addEventListener("change", () => {
        touchSoundEnabled = soundToggleCheckbox.checked;
    });

    gameBoard?.addEventListener("click", (event) => {
        if (event.target.classList.contains("card") && touchSoundEnabled && buttonSound) {
            buttonSound.currentTime = 0;
            buttonSound.play().catch(() => { });
        }
    });
});

function playGameOverSound() {
    const soundCheckbox = document.getElementById('sound');
    const gameOverAudio = document.getElementById('gameover-sound');

    if (gameOverAudio && soundCheckbox && soundCheckbox.checked) {
        gameOverAudio.currentTime = 0;
        gameOverAudio.play().catch(error => console.log('Audio playback prevented:', error));
    }
}

function playWinSound() {
    const soundCheckbox = document.getElementById('sound');
    const winAudio = document.getElementById('gameWin-sound');

    if (winAudio && soundCheckbox && soundCheckbox.checked) {
        winAudio.currentTime = 0;
        winAudio.play().catch(error => console.log('Audio playback prevented:', error));
    }
}

// Start Game
initializeGame();