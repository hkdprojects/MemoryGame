// --- DOM Elements ---
const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restartButton');
const pauseButton = document.getElementById('pauseButton');
const message = document.getElementById('content');
const gameBody = document.getElementById('body');
const cover = document.getElementById('cover');
const popupButtons = document.getElementById('popupButtons');
const startButton = document.getElementById('openCovers');
const playButton = document.getElementById('play');
const settings = document.getElementById('settings');
const musicDiv = document.getElementById('musicDiv');
const closeBtn = document.getElementById('close');
const coverBtnS = document.getElementById('coverBtnS');
const info = document.getElementById('info');
const cardsId = document.getElementById('cardsId');

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
let won = false;

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
    gameBoard.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'flipped');
        cardElement.id = 'cardsId';
        cardElement.dataset.name = card.name;
        cardElement.dataset.index = index;
        cardElement.innerHTML = card.name;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    // Reset State Variables
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    won = false;
    movesLeft = baseCardsArray.length * 2;
    hintCount = 0;

    // Reset UI
    enableBtn();
    countMoves(movesLeft);
    updateHint(hintCount);
}

// --- Card Logic ---
function flipCard() {
    if (lockBoard || this === firstCard || this.classList.contains('matched')) return;

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

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        disableCards();
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');

    const index1 = parseInt(firstCard.dataset.index, 10);
    const index2 = parseInt(secondCard.dataset.index, 10);

    cards[index1].status = 'matched';
    cards[index2].status = 'matched';

    matches++;
    resetBoard();

    if (matches === baseCardsArray.length) {
        won = true;
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

        if (movesLeft === 0 && !won) {
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

    //deselecting first card 
    if (firstCard) {
        firstCard.classList.remove('unflip');
        resetBoard();
    }

    // Find first unmatched card name
    const unmatchedCard = cards.find(card => card.status === 'unmatched');
    if (!unmatchedCard) return;

    // Select matching DOM elements using data-name
    const matchingCards = document.querySelectorAll(`[data-name="${unmatchedCard.name}"]`);

    matchingCards.forEach(card => card.classList.add('cardsHint'));
    setTimeout(() => {
        matchingCards.forEach(card => card.classList.remove('cardsHint'));
    }, 1000);

    hintCount++;
    updateHint(hintCount);
}

// --- Moves & Status ---
function countMoves(value) {
    const countValue = document.getElementById('display-value');
    if (countValue) {
        countValue.innerText = value;
        countValue.style.color = value <= 3 ? '#FF1600' : '#000';
    }
}

// --- Game Flow Control ---
function gameCompleted() {
    if (message) message.innerHTML = 'You Won!';

    const details = document.createElement('p');
    details.innerHTML = `Total Moves: ${baseCardsArray.length * 2 - movesLeft}<br>
    Hints: ${hintCount}`;
    details.classList.add('popup-details');
    message.appendChild(details);

    popupButtons.classList.add('won');

    playWinSound();
    showPopup();
    lockBoard = true;
}

function gameLost() {
    if (message) message.innerHTML = 'You Lost!<br>😟';

    playGameOverSound();
    showPopup();
    disableBtn();
}

function disableBtn() {
    if (pauseButton) pauseButton.style.pointerEvents = 'none';
    if (settings) settings.style.pointerEvents = 'none';
    if (cardsId) cardsId.style.pointerEvents = 'none';
    if (gameBody) gameBody.style.opacity = '0.5';
    lockBoard = true;
}

function enableBtn() {
    if (pauseButton) pauseButton.style.pointerEvents = 'auto';
    if (settings) settings.style.pointerEvents = 'auto';
    if (gameBody) gameBody.style.opacity = '1';
    lockBoard = false;
}

function pauseGame() {
    popupButtons.classList.remove('won');
    if (message) message.innerHTML = 'Game Paused';
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "25%";
    if (playButton) playButton.style.visibility = 'visible';
    disableBtn();
}

function playGame() {
    if (message) message.innerHTML = 'Game Starts';
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "-50%";
    enableBtn();
}

function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "25%";
    if (playButton) playButton.style.visibility = 'hidden';
    popupButtons.classList.add('won');
    disableBtn();
}

function hidePopup() {
    const popup = document.getElementById('popup');
    if (popup) popup.style.top = "-50%";
    if (message) message.innerHTML = 'All the best';
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
    if (popup) popup.style.top = "25%";
    if (cover) cover.style.transform = 'translateY(0)';
    changeButtonBackground(pauseButton, 0);
}

function changeButtonBackground(button, option) {
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
    hidePopup()
});

pauseButton?.addEventListener('click', () => {
    changeButtonBackground(pauseButton, 1);
    pauseGame()
});

playButton?.addEventListener('click', () => {
    changeButtonBackground(pauseButton, 0);
    playGame()
});

settings?.addEventListener('click', () => {
    if (musicDiv) musicDiv.style.left = "10%";
    changeButtonBackground(settings, 1);
    disableBtn();
    if (info) info.innerText = 'Please close Settings before you Play';
});

closeBtn?.addEventListener('click', () => {
    if (musicDiv) musicDiv.style.left = "-80%";
    changeButtonBackground(settings, 0);
    if (coverBtnS.style.pointerEvents === 'none') {
        coverBtnS.style.pointerEvents = 'auto';
        startButton.style.pointerEvents = 'auto';

    }
    if (info) info.innerText = '';

    enableBtn();
});

coverBtnS?.addEventListener('click', () => {
    if (musicDiv) musicDiv.style.left = "10%";
    coverBtnS.style.pointerEvents = 'none';
    startButton.style.pointerEvents = 'none';
    disableBtn();
    if (info) info.innerText = 'Please close Settings before you Play';
});

// --- Audio & DOM Setup ---
document.addEventListener("DOMContentLoaded", () => {
    const backgroundMusic = document.getElementById("background-music");
    const buttonSound = document.getElementById("button-sound");
    const toggleCheckbox = document.getElementById("music");
    const soundToggleCheckbox = document.getElementById("sound");

    let touchSoundEnabled = true;

    if (backgroundMusic) {
        backgroundMusic.play().catch(() => {
            console.log("Autoplay prevented by browser.");
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
            buttonSound.play();
        }
    });

});

// Play Game Over Sound
function playGameOverSound() {
    const soundCheckbox = document.getElementById('sound');
    const gameOverAudio = document.getElementById('gameover-sound');


    if (gameOverAudio && soundCheckbox && soundCheckbox.checked) {
        gameOverAudio.currentTime = 0; // Reset sound to start
        gameOverAudio.play().catch(error => console.log('Audio playback prevented:', error));
    }
}

// Play Win / Victory Sound
function playWinSound() {
    const soundCheckbox = document.getElementById('sound');
    const winAudio = document.getElementById('gameWin-sound');


    if (winAudio && soundCheckbox && soundCheckbox.checked) {
        winAudio.currentTime = 0; // Reset sound to start
        winAudio.play().catch(error => console.log('Audio playback prevented:', error));
    }
}

// Start Game
initializeGame();