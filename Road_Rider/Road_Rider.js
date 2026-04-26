const scoreDisplay = document.querySelector(".score");
const startScreen = document.querySelector(".start__menu");
const gameArea = document.querySelector(".gamearea");

let player = { speed: 5, score: 0 };
let gameAudio = new Audio("audio/game-audio.mp3");
gameAudio.loop = true;

// 🔥 DIFFICULTY
let difficulty = "medium";

document.querySelectorAll(".difficulty__button").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".difficulty__button").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        difficulty = btn.classList.contains("easy") ? "easy" :
                     btn.classList.contains("hard") ? "hard" : "medium";

        document.querySelector(".difficulty-selected").innerText = "Selected: " + difficulty;
    });
});

// 🔥 START GAME
document.querySelector(".game__start").addEventListener("click", startGame);

// 🔥 AUDIO UNLOCK (important for iframe)
document.addEventListener("click", () => {
    gameAudio.play().catch(() => {});
}, { once: true });

function startGame() {
    startScreen.classList.add("hide");
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;

    if (difficulty === "easy") player.speed = 3;
    if (difficulty === "medium") player.speed = 5;
    if (difficulty === "hard") player.speed = 8;

    window.requestAnimationFrame(gamePlay);

    // 🔥 PLAY AUDIO
    gameAudio.currentTime = 0;
    gameAudio.play().catch(() => {});

    // road lines
    for (let x = 0; x < 5; x++) {
        let roadLine = document.createElement("div");
        roadLine.setAttribute("class", "line");
        roadLine.y = (x * 150);
        roadLine.style.top = roadLine.y + "px";
        gameArea.appendChild(roadLine);
    }

    // player car
    let car = document.createElement("div");
    car.setAttribute("class", "car");
    gameArea.appendChild(car);

    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    // enemies
    for (let x = 0; x < 3; x++) {
        let enemy = document.createElement("div");
        enemy.setAttribute("class", "enemy");
        enemy.y = ((x + 1) * 300) * -1;
        enemy.style.top = enemy.y + "px";
        enemy.style.left = Math.floor(Math.random() * 350) + "px";
        enemy.style.backgroundImage = `url("image/enemy${Math.floor(Math.random() * 5) + 1}.png")`;
        gameArea.appendChild(enemy);
    }
}

// 🔥 KEYS
let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

function keyDown(e) {
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e) {
    e.preventDefault();
    keys[e.key] = false;
}

// 🔥 GAME LOOP
function gamePlay() {
    let car = document.querySelector(".car");
    let road = gameArea.getBoundingClientRect();

    if (player.start) {

        moveLines();
        moveEnemy(car);

        // movement
        if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
        if (keys.ArrowDown && player.y < (road.height - 100)) player.y += player.speed;
        if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
        if (keys.ArrowRight && player.x < (road.width - 50)) player.x += player.speed;

        car.style.top = player.y + "px";
        car.style.left = player.x + "px";

        player.score++;
        scoreDisplay.innerText = "Score: " + player.score;

        window.requestAnimationFrame(gamePlay);
    }
}

// 🔥 MOVE ROAD
function moveLines() {
    let lines = document.querySelectorAll(".line");

    lines.forEach(line => {
        if (line.y >= 700) {
            line.y -= 750;
        }
        line.y += player.speed;
        line.style.top = line.y + "px";
    });
}

// 🔥 MOVE ENEMY
function moveEnemy(car) {
    let enemy = document.querySelectorAll(".enemy");

    enemy.forEach(item => {
        if (isCollide(car, item)) {
            endGame();
        }

        if (item.y >= 750) {
            item.y = -300;
            item.style.left = Math.floor(Math.random() * 350) + "px";
        }

        item.y += player.speed;
        item.style.top = item.y + "px";
    });
}

// 🔥 COLLISION
function isCollide(a, b) {
    let aRect = a.getBoundingClientRect();
    let bRect = b.getBoundingClientRect();

    return !(
        aRect.bottom < bRect.top ||
        aRect.top > bRect.bottom ||
        aRect.right < bRect.left ||
        aRect.left > bRect.right
    );
}

// 🔥 END GAME
function endGame() {
    player.start = false;

    gameAudio.pause();

    startScreen.classList.remove("hide");
    startScreen.querySelector(".game__start").innerText = "Restart Game";
}