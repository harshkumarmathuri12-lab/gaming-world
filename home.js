// OPEN GAME
function openGame(gameFile) {
    const container = document.getElementById("game-container");
    const frame = document.getElementById("game-frame");

    container.style.display = "block";
    frame.src = gameFile;

    // prevent background scroll
    document.body.style.overflow = "hidden";
}

// CLOSE GAME
function closeGame() {
    const container = document.getElementById("game-container");
    const frame = document.getElementById("game-frame");

    container.style.display = "none";
    frame.src = "";

    // enable scroll again
    document.body.style.overflow = "auto";
}

// ESC KEY CLOSE (IMPORTANT UX)
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeGame();
    }
});

// CLICK OUTSIDE CLOSE (OPTIONAL BUT PRO)
document.getElementById("game-container").addEventListener("click", function (e) {
    if (e.target.id === "game-container") {
        closeGame();
    }
});