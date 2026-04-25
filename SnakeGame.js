const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
let snake = [{ x: 100, y: 100 }];
let food = generateFood();
let direction = "RIGHT";
let score = 0;
let gameInterval;

// Start the game
function startGame() {
    score = 0;
    document.getElementById("score").textContent = `Score: ${score}`;
    snake = [{ x: 100, y: 100 }];
    food = generateFood();
    direction = "RIGHT";
    gameInterval = setInterval(gameLoop, 100);
    document.getElementById("startButton").disabled = true;
}

// Game loop
function gameLoop() {
    clearCanvas();
    moveSnake();
    checkCollisions();
    drawSnake();
    drawFood();
    updateScore();
}

// Clear the canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Move the snake based on the current direction
function moveSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= gridSize;
    if (direction === "DOWN") head.y += gridSize;
    if (direction === "LEFT") head.x -= gridSize;
    if (direction === "RIGHT") head.x += gridSize;

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood(); // Eat food and generate new one
        score += 10; // Increase score
    } else {
        snake.pop(); // Remove the tail if no food is eaten
    }
}

// Draw the snake on the canvas
function drawSnake() {
    ctx.fillStyle = "lime";
    snake.forEach((segment, index) => {
        ctx.fillRect(segment.x, segment.y, gridSize, gridSize);
        // Add a glow effect for better visual
        if (index === 0) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "lime";
        }
    });
    ctx.shadowBlur = 0; // Reset shadow after the snake head
}

// Draw the food on the canvas
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

// Generate random food position
function generateFood() {
    const x = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    const y = Math.floor(Math.random() * (canvasSize / gridSize)) * gridSize;
    return { x, y };
}

// Check for collisions with walls or self
function checkCollisions() {
    const head = snake[0];

    // Collision with walls
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        endGame();
    }

    // Collision with self
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            endGame();
        }
    }
}

// End the game
function endGame() {
    clearInterval(gameInterval);
    alert("Game Over! Your score is " + score);
    document.getElementById("startButton").disabled = false;
}

// Update the score on the screen
function updateScore() {
    document.getElementById("score").textContent = `Score: ${score}`;
}

// Listen for arrow key inputs to change snake direction
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp" && direction !== "DOWN") {
        direction = "UP";
    } else if (event.key === "ArrowDown" && direction !== "UP") {
        direction = "DOWN";
    } else if (event.key === "ArrowLeft" && direction !== "RIGHT") {
        direction = "LEFT";
    } else if (event.key === "ArrowRight" && direction !== "LEFT") {
        direction = "RIGHT";
    }
});
