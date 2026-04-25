function openGame(url) {
    document.getElementById("game-container").style.display = "flex";
    document.getElementById("game-frame").src = url;
}

function closeGame() {
    document.getElementById("game-container").style.display = "none";
    document.getElementById("game-frame").src = "";
}