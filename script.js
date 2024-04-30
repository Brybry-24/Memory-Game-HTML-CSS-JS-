window.onload = function() {
    document.body.style.zoom = "90%";
};

const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let i = clonedArray.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1))
        const original = clonedArray[i]

        clonedArray[i] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let i = 0; i < items; i++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')  

    if (dimensions % 1 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
    const imageUrls = [
        'bry.png',
        'bry.png',
        'xiaa.png',
        'xiaa.png',
        'minna.png',
        'ame.png',
        'heart.png',
        'loadcatt.gif',

        
    ];
    
    const picks = pickRandom(imageUrls, (dimensions * dimensions) / 2);
    const items = shuffle([...picks, ...picks]);
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(imageUrl => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back"><img  class="card-image"src="${imageUrl}"></div>
                </div>
            `).join('')}
       </div>
    `;
    
    const parser = new DOMParser().parseFromString(cards, 'text/html');
    selectors.board.replaceWith(parser.querySelector('.board'));
    

}

//     const emojis = ['🥔', '🍒', '🥑', '🌽', '🥕', '🍇', '🍉', '🍌', '🥭', '🍍']
//     const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
//     const items = shuffle([...picks, ...picks])
//     const cards = `
//         <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
//             ${items.map(item => `
//                 <div class="card">
//                     <div class="card-front"></div>
//                     <div class="card-back">${item}</div>
//                 </div>
//             `).join('')}
//        </div>
//     `
    
//     const parser = new DOMParser().parseFromString(cards, 'text/html')

//     selectors.board.replaceWith(parser.querySelector('.board'))
// }



const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

      // Create an audio element

  const startSound = new Audio('UsadaPekoraBGM8BIT.mp3'); // Replace 'background_music.mp3' with the path to your audio file
    //   audio.loop = true; // Loop the audio
      startSound.play();
      // startSound.volume = 0.5; 

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `Time: ${state.totalTime} sec`
        
        // Check if 25 seconds have elapsed
        if (state.totalTime >= 20) {
            clearInterval(state.loop); // Stop the timer
            // Redirect the page after 25 seconds
            const losingSound = new Audio('lose.mp3'); // Replace 'losing.mp3' with the path to your losing sound effect
            startSound.pause();
            // losingSound.volume = 0.5;
            losingSound.play(); // Play the losing sound effect
            // Pause the background music
            setTimeout(() => {
                window.location.href = 'retry.html'; // Replace 'retry_page.html' with the URL of your retry page
            }, 2000); // 2 seconds in milliseconds
        }
    }, 1000)
}
const audioUrls = [
    'https://s3-us-west-2.amazonaws.com/s.cdpn.io/605876/t-shirt-cannon-pop.mp3',
    'cardflip.mp3',

    
];
const flipSound = new Audio('cardflip.mp3'); // Replace 'flip_sound.mp3' with the path to your flip sound effect
const flipCard = card => {
    state.flippedCards++;
    state.totalFlips++;
    // flipSound.volume = 0.5; // Adjust the volume if needed
    flipSound.play();

    if (!state.gameStarted) {
        startGame();
    }

    card.classList.add('flipped');

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        if (flippedCards[0].querySelector('img').src === flippedCards[1].querySelector('img').src) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        } else {
            setTimeout(() => {
                flippedCards.forEach(card => card.classList.remove('flipped'));
            }, 500);
        }

        state.flippedCards = 0; // Reset flipped card count
    }

    if (!document.querySelectorAll('.card:not(.matched)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped');
            selectors.win.innerHTML = `
                <span class="win-text">
                    <p style="display: inline-block;
                       margin-left: 5px;
                       font-family: Press Start 2P, cursive;
                       color: #e5ff00; 
                       text-shadow: 2px 2px 0px #ff00c8, 3px 3px 0px #000;
                       cursor: pointer;"> Yey Bebi! ٩(๑･ิᴗ･ิ)۶</p> <br />   
                    <a  class="button-57" href="file:///C:/Users/Bry/Desktop/bebi%20b-day/prizeload.html">
                    <span class="text">???</span><span>Reveal now?</span></a>
                </span>
            `;
            clearInterval(state.loop);
        }, 500);
        const losingSound = new Audio('win.mp3'); // Replace 'losing.mp3' with the path to your losing sound effect
        // losingSound.volume = 0.5;
        losingSound.play(); 
    }
};


// const flipBackCards = () => {
//     document.querySelectorAll('.card:not(.matched)').forEach(card => {
//         card.classList.remove('flipped')
//     })

//     state.flippedCards = 0
// }

// const flipCard = card => {
//     state.flippedCards++
//     state.totalFlips++

//     if (!state.gameStarted) {
//         startGame()
//     }

//     if (state.flippedCards <= 2) {
//         card.classList.add('flipped')
//     }

//     if (state.flippedCards === 2) {
//         const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

//         if (flippedCards[0].innerText === flippedCards[1].innerText) {
//             flippedCards[0].classList.add('matched')
//             flippedCards[1].classList.add('matched')
//         }

//         setTimeout(() => {
//             flipBackCards()
//         }, 1000)
//     }
//     if (!document.querySelectorAll('.card:not(.flipped)').length) {
//         setTimeout(() => {
//             selectors.boardContainer.classList.add('flipped')
//             selectors.win.innerHTML = `
//                 <span class="win-text">
//                    <p style="display: inline-block;
//                    margin-left: 5px;
//                    font-family: Press Start 2P, cursive;
//                    color: #ffcc00; 
//                    text-shadow: 2px 2px 0px #000, 4px 4px 0px #000;
//                    cursor: pointer;"> Yey Bebi! </p> <br />   
//             <a   class="win-text-hover" href="file:///C:/Users/Bry/Desktop/bebi%20b-day/loading.html" style="display: inline-block;
//             text-decoration: none;
//             margin-left: 5px;
//             font-family: 'Press Start 2P', cursive;
//             color: #ffcc00; 
//             text-shadow: 2px 2px 0px #000, 4px 4px 0px #000;
//             cursor: pointer;"
//             >
//             Check your Prizes</a>
//             </span>
//             `
//   // with <span class="highlight">${state.totalFlips}</span> moves<br />
//                     // under <span class="highlight">${state.totalTime}</span> seconds
//             clearInterval(state.loop)
//         }, 1000)
//     }
// }

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()
