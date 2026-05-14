// 🔥 SAFE ELEMENT GET
const container = document.getElementById("game-container");
const frame = document.getElementById("game-frame");

// OPEN GAME
function openGame(gameFile) {
    if (!container || !frame) return;

    container.style.display = "block";

    // 🔥 FORCE RELOAD (important for sound + fixes caching issues)
    frame.src = gameFile + "?t=" + new Date().getTime();

    // prevent background scroll
    document.body.style.overflow = "hidden";

    // 🔥 focus iframe (helps interaction + audio permission)
    frame.onload = () => {
        try {
            frame.contentWindow.focus();
        } catch (e) {}
    };
}

// CLOSE GAME
function closeGame() {
    if (!container || !frame) return;

    container.style.display = "none";
    frame.src = "";

    document.body.style.overflow = "auto";
}

// ESC KEY CLOSE
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeGame();
    }
});

// CLICK OUTSIDE CLOSE (SAFE VERSION)
if (container) {
    container.addEventListener("click", function (e) {
        if (e.target === container) {
            closeGame();
        }
    });
}

// 🔥 PREVENT SCROLL WHEN GAME OPEN (EXTRA SAFETY)
window.addEventListener("wheel", function (e) {
    if (container && container.style.display === "block") {
        e.preventDefault();
    }
}, { passive: false });