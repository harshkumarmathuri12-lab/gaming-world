const score = document.querySelector('.score'),
  startBtn = document.querySelector('.game__start'),
  gameArea = document.querySelector('.gamearea'),
  car = document.createElement('div'),
  diffBtn = document.querySelectorAll('.difficulty__button'),
  diffSelected = document.querySelector('.difficulty-selected'),
  screens = document.querySelectorAll('.screen'),
  startMenu = document.querySelector('.start__menu');

const enemyStyles = ['enemy1', 'enemy2', 'enemy3', 'enemy4', 'enemy5'];

car.classList.add('car');

document.addEventListener('keydown', startGame);
document.addEventListener('keyup', stopGame);

const music = ['./audio/game-audio.mp3'];
const audio = new Audio();
audio.src = music[0];
audio.volume = 0.1;

const keys = {
  ArrowDown: false,
  ArrowUp: false,
  ArrowLeft: false,
  ArrowRight: false,
};

const settings = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3,
};

function getQuantityElements(heightElement) {
  return document.documentElement.clientHeight / heightElement + 1;
}

function random(num) {
  return Math.floor(Math.random() * num);
}

// 🔥 LANGUAGE FIX ONLY
diffBtn.forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('easy')) {
      settings.speed = 3;
      settings.traffic = 3.5;
      diffSelected.textContent = 'Difficulty selected: Easy';
      diffBtn.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

    } else if (item.classList.contains('medium')) {
      settings.speed = 5;
      settings.traffic = 3;
      diffSelected.textContent = 'Difficulty selected: Medium';
      diffBtn.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

    } else if (item.classList.contains('hard')) {
      settings.speed = 7;
      settings.traffic = 2.5;
      diffSelected.textContent = 'Difficulty selected: Hard';
      diffBtn.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    }
  });
});

startBtn.addEventListener('click', () => {
  startMenu.classList.add('hide');
  gameArea.innerHTML = '';
  car.style.left = '225px';
  car.style.bottom = '75px';
  screens[0].classList.add('screen-up');

  for (let i = 0; i < getQuantityElements(80); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = i * 80 + 'px';
    line.y = i * 80;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < getQuantityElements(80 * settings.traffic); i++) {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.y = -100 * settings.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background =
      'rgba(0,0,0,0) url(./image/' +
      enemyStyles[random(enemyStyles.length)] +
      '.png) center / cover no-repeat';
    gameArea.appendChild(enemy);
  }

  settings.score = 0;
  settings.start = true;
  gameArea.appendChild(car);
  settings.x = car.offsetLeft;
  settings.y = car.offsetTop;

  audio.play();
  requestAnimationFrame(playGame);
});

function startGame(e) {
  e.preventDefault();
  keys[e.key] = true;
}

function stopGame(e) {
  e.preventDefault();
  keys[e.key] = false;
}

function playGame() {
  if (settings.start) {
    settings.score += settings.speed;
    score.innerHTML = 'Score <br>' + settings.score;

    moveRoad();
    moveEnemy();

    if (keys.ArrowLeft && settings.x > 0) settings.x -= settings.speed;
    if (keys.ArrowRight && settings.x < gameArea.offsetWidth - car.offsetWidth) settings.x += settings.speed;
    if (keys.ArrowUp && settings.y > 0) settings.y -= settings.speed;
    if (keys.ArrowDown && settings.y < gameArea.offsetHeight - car.offsetHeight) settings.y += settings.speed;

    car.style.top = settings.y + 'px';
    car.style.left = settings.x + 'px';

    requestAnimationFrame(playGame);
  }
}

function moveRoad() {
  document.querySelectorAll('.line').forEach(line => {
    line.y += settings.speed;
    line.style.top = line.y + 'px';
    if (line.y >= window.innerHeight) line.y = -80;
  });
}

function moveEnemy() {
  document.querySelectorAll('.enemy').forEach(enemy => {
    let carRect = car.getBoundingClientRect();
    let enemyRect = enemy.getBoundingClientRect();

    if (
      carRect.top <= enemyRect.bottom &&
      carRect.right >= enemyRect.left &&
      carRect.left <= enemyRect.right &&
      carRect.bottom >= enemyRect.top
    ) {
      settings.start = false;
      audio.pause();
      startMenu.classList.remove('hide');
    }

    enemy.y += settings.speed / 2;
    enemy.style.top = enemy.y + 'px';

    if (enemy.y >= window.innerHeight) {
      enemy.y = -80 * settings.traffic;
      enemy.style.left = Math.random() * (gameArea.offsetWidth - 50) + 'px';
    }
  });
}