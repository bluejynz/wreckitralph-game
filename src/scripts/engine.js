const state = {
  view: {
    squares: document.querySelectorAll(".square"),
    ralph: document.querySelector(".ralph"),
    timeLeft: document.querySelector("#time-left"),
    score: document.querySelector("#score"),
    lives: document.querySelector("#lives"),
  },
  values: {
    gameVelocity: 1000,
    hitPosition: 0,
    points: 0,
    currentTime: 60,
    highscore: 0,
    totalTime: 60,
    livesLeft: 3,
  },
  actions: {
    timerId: setInterval(randomSquare, 1000),
    countdownTimerId: setInterval(countdown, 1000),
  }
};

function gameOver(endType) {
  clearInterval(state.actions.timerId);
  clearInterval(state.actions.countdownTimerId);

  let confirmText = "";

  if(state.values.points > state.values.highscore) {
    state.values.highscore = state.values.points;

    confirmText = `CONGRATS, HIGHSCORE!!!\nScore: ${state.values.points}\nPlay again?`;
  } else if(endType === "dead") {
    confirmText = `Game Over!\nScore: ${state.values.points}\nPlay again?`;
  } else {
    confirmText = `Time's up!\nScore: ${state.values.points}\nPlay again?`;
  }
  
  alert(confirmText);
  reset();
}

function reset() {
  state.values.hitPosition = 0;
  state.values.points = 0;
  state.values.currentTime = state.values.totalTime;
  state.values.livesLeft = 3;

  state.view.timeLeft.textContent = state.values.currentTime;
  state.view.score.textContent = state.values.points;
  state.view.lives.textContent = "x" + state.values.livesLeft;

  state.actions.timerId = setInterval(randomSquare, 1000);
  state.actions.countdownTimerId = setInterval(countdown, 1000);
}

function countdown() {
  state.values.currentTime--;
  state.view.timeLeft.textContent = state.values.currentTime;
  
  if(state.values.currentTime <= 0) {
    gameOver("timeup");
  }
}

function playSound(name) {
  let audio = new Audio(`./src/sounds/${name}.m4a`);
  audio.volume = 0.2;
  audio.play();
}

function randomSquare() {
  state.view.squares.forEach((s) => {
    s.classList.remove("ralph");
  });

  let rngNum = Math.floor(Math.random() * 9);
  let rngSqr = state.view.squares[rngNum]
  rngSqr.classList.add("ralph");

  state.values.hitPosition = rngSqr.id;
}

function addListenerHitBox() {
  state.view.squares.forEach((s) => {
    s.addEventListener("mousedown", () => {
      if(s.id === state.values.hitPosition) {
        state.values.points++;
        state.view.score.textContent = state.values.points;
        state.values.hitPosition = null;
        playSound("hit");
      } else {
        state.values.livesLeft--;
        state.view.lives.textContent = "x" + state.values.livesLeft;
        playSound("fail");

        if(state.values.livesLeft <= 0) {
          gameOver("dead");
        }
      }
    })
  })
}

function init() {
  addListenerHitBox();
}

init();