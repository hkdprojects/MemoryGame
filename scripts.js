const gameBoard = document.getElementById('game-board');
const restartButton = document.getElementById('restartButton');
const pausebutton = document.getElementById('pauseButton');
const message= document.getElementById('content');
const gameBody = document.getElementById('body');
const cover = document.getElementById('cover');
const startButton = document.getElementById('open');
const playButton = document.getElementById('play');
const settings = document.getElementById('settings');
const musicDiv = document.getElementById('musicDiv');
const close = document.getElementById('close');

const cardsArray = [
    { name: 'A', img: 'https://via.placeholder.com/80/FFFFFF/000000?text=A' },
    { name: 'B', img: 'https://via.placeholder.com/80/FFFFFF/000000?text=B' },
    { name: 'C', img: 'https://via.placeholder.com/80/FFFFFF/000000?text=C' },
    { name: 'D', img: 'https://via.placeholder.com/80/FFFFFF/000000?text=D' },
    { name: 'E', img: 'https://via.placeholder.com/80/FFFFFF/000000?text=E' },
    { name: 'F', img:'https://via.placeholder.com/80/FFFFFF/000000?text=F'},
];

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matches = 0;
let count=0;

function initializeGame() {
    cards = [...cardsArray, ...cardsArray];
    cards.sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card', 'col-3');
        cardElement.dataset.name = card.name;
        cardElement.innerHTML = `<img src="${card.img}" alt="${card.name}">`;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matches = 0;
    enableBtn();
    count=cardsArray.length*2;
    countMoves(count);
}

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
    count--;
    countMoves(count);
}

function checkForMatch() {
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;
    isMatch ? disableCards() : unflipCards();
}


//celebation
function showCelebration(){
    
}
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
    matches++;
    if (matches === cardsArray.length) {
        content.innerHTML='You Won';
        showPopup();
        showCelebration();
        firstCard = null;
        secondCard = null;
        lockBoard = true;
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}


restartButton.addEventListener('click', function() {
    hidePopup();
});

pauseButton.addEventListener('click',function(){
    pauseGame();
})

playButton.addEventListener('click',function () {
    playGame();
})

settings.addEventListener('click',function(){
    settings.style.backgroundColor='white';
    musicDiv.style.left="10%"
    disableBtn();

})

close.addEventListener('click',function(){
    musicDiv.style.left="-80%"
    settings.style.backgroundColor='';
    enableBtn();
})

function countMoves(value){
    const countValue=document.getElementById('display-value');
    if(value <= 0) {
        countValue.innerHTML=value;
        content.innerHTML='You lost';
        showPopup();
        disableBtn();
    }
    else{
        countValue.innerHTML=value;
    }
    if(value <= 3)
    {
        countValue.style.color='#FF1600';
    }
    else
    {
        countValue.style.color='#000';
    }
}

function disableBtn() {
    document.getElementById("restartButton").disabled = true;
    document.getElementById("pauseButton").disabled = true;
    gameBody.style.opacity=0.5;
    lockBoard = true;
}

function enableBtn() {
    document.getElementById("restartButton").disabled = false;
    document.getElementById("pauseButton").disabled = false;
    gameBody.style.opacity=1;
    lockBoard = false;
}

function pauseGame()
{
    content.innerHTML='Game Paused';
    document.getElementById('popup').style.top = "25%";
    playButton.style.visibility='visible';
    disableBtn();
}

function playGame()
{
    content.innerHTML='Game Starts';
    document.getElementById('popup').style.top = "-50%";
    enableBtn();
}

function stopGame()
{
    firstCard = null;
    secondCard = null;
    lockBoard = true;
    flipCard();
    disableBtn();
    disableCards();
}

function showPopup() {
    document.getElementById('popup').style.top = "25%";
    playButton.style.visibility='hidden';
    stopGame()
}

function hidePopup() {
    document.getElementById('popup').style.top = "-50%";
    content.innerHTML='All the best';
    initializeGame();
}


function openGame() {
    hidePopup();
    cover.style.transform = 'translateY(-100%)';
}

function closeGame() {
    content.innerHTML='Bye';
    document.getElementById('popup').style.top = "25%";
    cover.style.transform = 'translateY(0)';
}

document.addEventListener("DOMContentLoaded", function() {
        const backgroundMusic = document.getElementById("background-music");
        const buttonSound = document.getElementById("button-sound");
        const toggleCheckbox = document.getElementById("music");
        const soundToggleCheckbox = document.getElementById("sound");

        let touchSoundEnabled = true;

        backgroundMusic.play().catch(function(error) {
            console.error("Error playing background music:", error);
        });

        toggleCheckbox.addEventListener("change", function() {
            if (toggleCheckbox.checked) {
                backgroundMusic.play();
            } else {
                backgroundMusic.pause();
                backgroundMusic.currentTime = 0;
            }
        });

        soundToggleCheckbox.addEventListener("change", function() {
            touchSoundEnabled = soundToggleCheckbox.checked;
        });

        const cardContainer = document.querySelector(".board");
        cardContainer.addEventListener("click", function(event) {
            if (event.target.classList.contains("card")) {
                if (touchSoundEnabled) {
                    buttonSound.currentTime = 0; 
                    buttonSound.play();
                }
            }
        });
    });

closeGame();
initializeGame();