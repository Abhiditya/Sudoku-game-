
let solutionBoard, currentBoard, lives, solutions;

function generateSudoku() {
    currentBoard = generateCompBoard();
    document.getElementById("board-overlay").style.display="none";
    lives=5;
    document.getElementById("lives").textContent=lives;
    solutionBoard = JSON.parse(JSON.stringify(currentBoard));
    solutions=[];
    let level=getLevel();
    removeNumbers(currentBoard, level);
    displayBoard(currentBoard);
}

document.getElementById("level").addEventListener("change", function() {
    generateSudoku();
});


function generateCompBoard() {
    let board = Array.from({ length: 9 }, () => Array(9).fill(0));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i=0; i<9; i++) {
        for (let j=0; j<9; j++) {
            if (board[i][j] === 0) {
                shuffleArray(numbers);
                for (let x of numbers) {
                    if (isValid(board, i, j, x)) {
                        board[i][j] = x;
                        if (fillBoard(board)) {
                            return true;
                        } else {
                            board[i][j] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function isValid(board, row, col, number) {
    for (let i=0; i<9; i++) {
        if (board[row][i] === number ||
            board[i][col] === number ||
            board[Math.floor(row / 3) * 3 + Math.floor(i / 3)][Math.floor(col / 3) * 3 + i % 3] === number) {
            return false;
        }
    }
    return true;
}

function shuffleArray(array) {
    for (let i=array.length - 1; i>0; i--) {
        const j=Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getLevel(){
    const level=document.getElementById("level").value;
    let diff;
    switch(level){
        case "easy":
            diff=40;
            break;
        case "medium":
            diff=55;
            break;
        case "hard":
            diff=64;
            break;
        default:
            diff=40;
    }
    return diff;
}

function removeNumbers(board, level) {
    let count = 0;
    while (count < level) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            solutions.push({ row, col, value: board[row][col] });
            board[row][col] = 0;
            count++;
        }
    }
}

function displayBoard(board) {
    const container = document.getElementById("sudoku-board");
    container.innerHTML = "";
    for (let i= 0; i<9; i++) {
        for (let j= 0; j<9; j++) {
            const tile = document.createElement("div");
            tile.className = "tile";
            if (board[i][j] === 0) {
                tile.classList.add("empty");
                tile.setAttribute("data-row",i);
                tile.setAttribute("data-col",j);
                tile.contentEditable=true;
                tile.addEventListener("input", handleInput);
                
            } else {
                tile.textContent = board[i][j];
                tile.contentEditable=false;
                tile.setAttribute("data-row",i);
                tile.setAttribute("data-col",j);
                if (solutions.find(num => num.row === i && num.col === j)) {
                    tile.classList.add("correct");
                }
                else{
                    tile.classList.add("full");
                }
            }
            container.appendChild(tile);
        }
    }
}

function handleInput(event){
    const tile= event.target;
    const row= parseInt(tile.getAttribute("data-row"));
    const col= parseInt(tile.getAttribute("data-col"));
    const value= parseInt(tile.textContent);
    if(isNaN(value) || value<1 || value>9){
        tile.textContent='';
        return;
    }
    if (solutionBoard[row][col] === value) {
        currentBoard[row][col] = value;
        tile.textContent = value;
        tile.classList.remove("empty");
        tile.classList.remove("incorrect");
        tile.classList.add("correct");
        tile.contentEditable = false;
        checkWin();
    } else {
        lives--;
        document.getElementById("lives").textContent = lives;
        tile.classList.remove("empty");
        tile.classList.add("incorrect");
        checkGameOver();
    }
}

function checkWin(){
    for(let i=0; i<9; i++){
        for(let j=0; j<9; j++){
            if(currentBoard[i][j]===0 || currentBoard[i][j]!==solutionBoard[i][j]){
                return;
            }
        }
    }
    document.getElementById("board-overlay").style.display="flex";
    document.getElementById("game-status").textContent = "Congratulations! You Win!";
}

function checkGameOver() {
    if (lives <= 0) {
        document.getElementById("board-overlay").style.display = "flex";
        document.getElementById("game-status").textContent = "Game Over!";
    }
}

function displaySolution() {
    for(let i of solutions){
        currentBoard[i.row][i.col]= i.value;
    }
    displayBoard(currentBoard);
}

document.getElementById("solve-btn").addEventListener("click", displaySolution);

window.onload = function() {
    lives=5;
    document.getElementById("lives").textContent=lives;
    generateSudoku();
}