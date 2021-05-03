let gamePlaying = true;
var number = 0;
let squares = document.querySelectorAll('.square');
let count = 0;
let active = 'X';
var gameStat3 = ['X', 'X', 'O', 'O', 'O', 'X', '', '', ''];
var gameStat2 = ['X', '', '', '', '', '', '', '', ''];
let node = new Node(number, gameStat2);
let gameStat = ['', '', '', '', '', '', '', '', ''];
let compMove = 0;
let resultString;
let DOMElememnts = [
  document.querySelector('.topLeft'),
  document.querySelector('.top'),
  document.querySelector('.topRight'),
  document.querySelector('.left'),
  document.querySelector('.center'),
  document.querySelector('.right'),
  document.querySelector('.bottomLeft'),
  document.querySelector('.bottom'),
  document.querySelector('.bottomRight'),
];

squares.forEach(el => el.addEventListener('click', squareClckHandler));

function squareClckHandler(e) {
  let element = e.target;
  let result;
  if (gamePlaying) {
    let clickedNum = parseInt(element.dataset.cellIndex, 10);
    if (element.textContent !== '') {
      return;
    }

    element.textContent = active;
    gameStat[clickedNum] = active;
    checkResult(); //checkResult(gameStat);

    let node = new Node(clickedNum, gameStat);
    compSwitch(node);
  }
}
function Node(num, gameStat) {
  this.value = 0;
  this.num = num;
  this.gameStat = gameStat;
  this.move = gameStat[num];
  this.leafNode = false;
  this.childrenNodes = [];
}
function compSwitch(node) {
  let result;
  let bestReply;

  if (gamePlaying) {
    bestReply = miniMax(node);
    DOMElememnts[bestReply.num].textContent = bestReply.move;
    gameStat[bestReply.num] = bestReply.move;
    checkResult();
  }
}

function checkResult() {
  let result = evaluate(gameStat);
  let { arrayOfXNodes, arrayOfONodes } = board(gameStat);
  let len = arrayOfONodes.length + arrayOfXNodes.length;
  if (result !== 0) {
    gamePlaying = false;
    if (len === 9) {
      if (result === 1) alert('Game is a Draw!!!');
      else if (result === 3) alert('Player X wins the game!!!');
      else if (result === 2) alert('Player O wins the game!!!');
    } else {
      if (result === 3) alert('Player X wins the game!!!');
      else if (result === 2) alert('Player O wins the game!!!');
    }
    return gamePlaying;
  } else if (result === 0) {
    gamePlaying = true;
    return gamePlaying;
  }
}

document.querySelector('#reset').addEventListener('click', e => {
  document.querySelector('#switchSide').disabled = false;
  squares.forEach(el => (el.textContent = ''));
  active = 'X';
  gameStat = ['', '', '', '', '', '', '', '', ''];
  document.querySelector('h3').textContent =
    'Player ' + active + "'s turn (New Game)";
  gamePlaying = true;
});

function switchPlayer() {
  active === 'X' ? (active = 'O') : (active = 'X');
  document.querySelector('h3').textContent = 'Player ' + active + "'s turn";
}

document.querySelector('#switchSide').addEventListener('click', e => {
  active === 'X' ? (active = 'O') : (active = 'X');
  document.querySelector('h3').textContent = 'Player ' + active + "'s turn";
});
//

//

function miniMax(node) {
  count++;

  let bestReply;
  console.log('Count= ' + count);
  let resultChild = false;
  let gameStatCopy = [...node.gameStat];
  let result = 0;
  let { emptyNodes, turnToMove } = board(gameStatCopy);
  let gameStatCopies = [];

  result = evaluate(gameStatCopy);

  //Case 1:  if the node is a leafnode

  if (emptyNodes.length < 1) {
    node.leafNode = true;
    node.value = result;

    return;
  }
  // Case 2: node is not a leaf node but has a result i.e a win for turnTomove
  else if (result !== 0) {
    node.value = result;
    return;
  }

  // Case 2.1 node is not a leaf node and also has no result - Continue recursive calling till eventually
  // end up to the above terminal cases: Case 1 and Case 2

  // Create all the possible child nodes' respective gameStat
  emptyNodes.forEach((el, ind) => {
    gameStatCopies[ind] = [...gameStatCopy];
    gameStatCopies[ind][el] = turnToMove;
  });

  let i = 0;

  // Create all the possible child nodes and call them recurssivelly by miniMax method
  for (const el of emptyNodes) {
    // if the node has not yet got a childNode with a result proceed to recurssively call the rest of the childNodes
    let childNode = new Node(el, gameStatCopies[i++]);
    miniMax(childNode);
    node.childrenNodes.push(childNode);

    if (node.move === 'X') {
      resultChild = childNode.value === 2;
    } else if (node.move === 'O') {
      resultChild = childNode.value === 3;
    }
    // Alph beta prunning - if i) is true  set the node value and break out of the loop
    if (resultChild) {
      node.value = childNode.value;
      break;
    }
  }

  // After going through all the child nodes
  let loseChildNodes = [];
  let drawChildNodes = [];
  let winChildNodes = [];
  // if condition is to determine the right value for the current node.
  if (node.value === 0) {
    if (node.move === 'X') {
      node.childrenNodes.forEach(el => {
        if (el.value === 2) loseChildNodes.push(el.value);
        else if (el.value === 1) drawChildNodes.push(el.value);
        else if (el.value === 3) winChildNodes.push(el.value);
      });
    } else if (node.move === 'O') {
      node.childrenNodes.forEach(el => {
        if (el.value === 3) loseChildNodes.push(el.value);
        else if (el.value === 1) drawChildNodes.push(el.value);
        else if (el.value === 2) winChildNodes.push(el.value);
      });
    }

    if (loseChildNodes.length > 0) {
      node.value = loseChildNodes[0];
    } else if (drawChildNodes.length > 0) {
      node.value = drawChildNodes[0];
    } else if (winChildNodes.length > 0) {
      node.value = winChildNodes[0];
    }
  } // end of if(node.value==0)

  [bestReply] = node.childrenNodes.filter(el => el.value === node.value);
  return bestReply;
}
function board(boardTicks) {
  let emptyNodes = [];
  let arrayOfXNodes = [];
  let arrayOfONodes = [];

  boardTicks.forEach((el, ind) => {
    if (el === 'X') {
      arrayOfXNodes.push(ind);
    } else if (el === 'O') {
      arrayOfONodes.push(ind);
    } else if (el === '') {
      emptyNodes.push(ind);
    }
  });
  if (arrayOfXNodes.length === arrayOfONodes.length) turnToMove = 'X';
  else if (arrayOfXNodes.length > arrayOfONodes.length) turnToMove = 'O';
  return { turnToMove, arrayOfXNodes, arrayOfONodes, emptyNodes };
}

function evaluate(gameState) {
  let roundResult = 0;
  let i;
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];

    if (a === b && b === c) {
      if (a === 'X') return 3;
      else if (a === 'O') return 2;
    }
  }

  for (i = 0; i <= 8; i++) {
    if (gameState[i] === '') return 0;
  }

  for (i = 0; i <= 7; i++) {
    const winCondition = winningConditions[i];
    let a = gameState[winCondition[0]];
    let b = gameState[winCondition[1]];
    let c = gameState[winCondition[2]];

    if (a !== b || b !== c) {
      return 1;
    }
  }
}
