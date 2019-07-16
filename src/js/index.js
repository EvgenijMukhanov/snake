window.onload = () => {

  let snake = [];
  let mouse = [];
  let score = 0;
  let game = 'game';
  let gamePause = false;
  let activeGame;
  let direction = 'right';
  let newDirection = 'right';

  let buildField = () => {
    let field = document.querySelector('.field');
    for (let i = 0; i <= 99; i++) {
      let cell = document.createElement('div');
      cell.classList = 'cell';
      cell.dataset.id = i;
      field.appendChild(cell);
    };
  };

  let clearField = () => {
    cells = [...document.querySelectorAll('.cell')];
    cells.map((item) => {
      item.className = 'cell';
    });
  };

  let getCell = (coordX, coordY) => {
    let serialNumberCell = coordY * 10 + coordX;
    let cells = [...document.querySelectorAll('.cell')];
    let cell;
    cells.map((item, i) => {
      if (i === serialNumberCell) {cell = item};      
    });
    return cell;
  };

  let setMouse = () => {
    let mouseX = Math.floor(Math.random() * 10);
    let mouseY = Math.floor(Math.random() * 10);
    let repeat = false;
    snake.map((item) => {
      if (item[0] === mouseX && item[1] === mouseY) {
        repeat = true;        
      };
    });
    if (repeat) {
      setMouse();
    } else {
      getCell(mouseX, mouseY).classList.add('cell-mouse');
      mouse = [mouseX, mouseY];
    };    
  };

  let getInitialState = () => {
    snake = [];
    let setSnake = () => {
      let startX = Math.floor(Math.random() * 10);
      let startY = Math.floor(Math.random() * 10);
      getCell(startX, startY).classList.add('cell-snakeHead');
      snake.push([startX, startY]);
      startX = (startX - 1) < 0 ? 9 : startX - 1;
      getCell(startX, startY).classList.add('cell-snakeBody');
      snake.push([startX, startY]);
      startX = (startX - 1) < 0 ? 9 : startX - 1;
      getCell(startX, startY).classList.add('cell-snakeBody');
      snake.push([startX, startY]);
    };
    setSnake();
    setMouse();
  };

  let setGamePause = () => {
    if (!gamePause && game !== 'endGame') {
      game = 'pause';
      document.querySelector('.status').innerHTML = 'Pause !!!';
      clearInterval(activeGame);
    } else if (game === 'pause') {
      activeGame = setInterval(snakeMove, 500);
      document.querySelector('.status').innerHTML = '';
      game = 'game';
    }
    gamePause = !gamePause;
  };

  let handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowRight':
        if (direction !== 'left') {newDirection = 'right'}
        break;
      case 'ArrowLeft':
        if (direction !== 'right') {newDirection = 'left'}
        break;
      case 'ArrowUp':
        if (direction !== 'down') {newDirection = 'up'}
        break;
      case 'ArrowDown':
        if (direction !== 'up') {newDirection = 'down'}
        break;
      case ' ':
        setGamePause();
        break;
      default:
    };
  };

  let setWin = () => {
    game = 'endGame';
    clearInterval(activeGame);
    document.querySelector('.status').innerHTML = 'You WIN !!!';
  };

  let setKeypressListener = () => {
    window.addEventListener('keydown', handleKeyPress)
  };

  let snakeMove = () => {

    let checkMouseEat = (coordX, coordY) => {
      return ((mouse[0] === coordX) && (mouse[1] === coordY))
    };

    let checkCrashSnake = (coordX, coordY) => {
      let crashed = false;
      snake.map((item) => {
        if((item[0] === coordX) && (item[1] === coordY)) {crashed = true}
      });
      return crashed;
    };

    if (direction !== newDirection) {direction = newDirection};
    
    let [ coordX, coordY ] = snake[0];
    switch (direction) {
      case 'right':
        coordX = (coordX + 1) >= 10 ? 0 : coordX + 1;
        break;
      case 'left':
        coordX = (coordX - 1) < 0 ? 9 : coordX - 1;
        break;
      case 'up':
        coordY = (coordY - 1) < 0 ? 9 : coordY - 1;
        break;
      case 'down':
        coordY = (coordY + 1) >= 10 ? 0 : coordY + 1;
        break;
      default:
    };

    if (checkCrashSnake(coordX, coordY)) {
      clearInterval(activeGame);
      getCell(coordX, coordY).classList.remove('cell-snakeBody');
      getCell(coordX, coordY).classList.remove('cell-snakeHead');
      getCell(coordX, coordY).classList.add('cell-crash');
      document.querySelector('.status').innerHTML = 'Defeat !!!';
      game = 'endGame';
    };
    
    let newSnake = [];
    newSnake.push([coordX, coordY]);
    getCell(coordX, coordY).classList.add('cell-snakeHead');
    for (let i = 0 ; i <= snake.length - 2; i++) {
      newSnake.push(snake[i]);
      getCell(snake[i][0], snake[i][1]).classList.add('cell-snakeBody');
      getCell(snake[i][0], snake[i][1]).classList.remove('cell-snakeHead');
    };

    if (checkMouseEat(coordX, coordY)) {
      score++;
      document.querySelector('.score').innerHTML = score;
      newSnake.push(snake[snake.length - 1]);
      getCell(coordX, coordY).classList.remove('cell-mouse');
      setMouse();
      if (snake.length >= 100) {
        setWin();
      }
    } else {
      getCell(snake[snake.length - 1][0], snake[snake.length - 1][1]).classList.remove('cell-snakeBody');
    };
    snake = newSnake;    
  };

  let newGame = () => {
    document.querySelector('.status').innerHTML = '';
    score = 0;
    document.querySelector('.score').innerHTML = score;
    game = 'game';
    gamePause = false;
    direction = 'right';
    newDirection = 'right';
    clearField();
    clearInterval(activeGame);
    getInitialState();
    game = 'game';
    setKeypressListener();
    activeGame = setInterval(snakeMove, 300);
  };

  buildField();  
  let buttonStart = document.querySelector('.newGame');
  buttonStart.addEventListener('click', newGame);
  
};