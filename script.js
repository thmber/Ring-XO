let names = ["Gandalf", "Gollum", "Orc", "Legolas", "Frodo"]
let distance1 = -66;
let distance2 = -83.5;
let playerCharacter = 0;
let fields = [];
let playerMoves = [];
let cpuMoves = [];
let fieldsFree = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let cpusFirstMove = [4, 4, 4, 4, 8, 4, 4, 4, 4];
let danger = false;
let cpuWon = false;
let playerWon = false;
let winningFields = [];

let dangerPosition1 = [0, 3, 0, 1, 4, 1, 2, 5, 2, 0, 1, 0, 3, 4, 3, 6, 7, 6, 0, 4, 0, 2, 4, 2];
let dangerPosition2 = [3, 6, 6, 4, 7, 7, 5, 8, 8, 1, 2, 2, 4, 5, 5, 7, 8, 8, 4, 8, 8, 4, 6, 6];
let dangerReaction = [6, 0, 3, 7, 1, 4, 8, 2, 5, 2, 0, 1, 5, 3, 4, 8, 6, 7, 8, 0, 4, 6, 2, 4];

let badMovePosition1 = [1, 1, 5, 3, 0, 0, 2, 0, 2, 3, 8, 0, 6];
let badMovePosition2 = [5, 3, 7, 7, 4, 8, 6, 7, 7, 2, 3, 5, 5];
let badMoveReaction = [2, 0, 8, 6, 6, 3, 5, 6, 8, 0, 6, 2, 8];

let sound = new Audio("audio/hit.mp3");


function fillShape(id){
    if (fieldsFree.indexOf(id) > -1) {
        fields[id] = playerCharacter;
        playerMoves.push(id);
        removeOptions(id);
        draw();  
        cpuAction();  
        if (cpuWon == true && playerWon == false) {
            cpuWins();}
    }
}


function removeOptions(id){
    let fieldCovered = fieldsFree.indexOf(id);
    fieldsFree.splice(fieldCovered, 1)
}


function cpuAction(){
    if (playerMoves.length == 1) {
       firstAction();
    }
    if (playerMoves.length == 2){
       secondAction();
    }
    if (playerMoves.length > 2){
       thirdAction();
    }
    if (playerMoves.length == 5) {
        tied();
    }
}


function firstAction(){
    let playerfield = playerMoves[0];
    let cpuAnswer = cpusFirstMove[playerfield];
    fillCpu(cpuAnswer);
}


function secondAction(){
    danger = false;
    checkForDanger();
    checkForBadMoves();
    randomCpuMove();
}


function randomCpuMove(){
    if (danger == false) {
        let random = Math.floor((Math.random()) * fieldsFree.length);
        fillCpu(fieldsFree[random]);
    }
}


function thirdAction(){
    danger = false;
    checkForPlayerWin();
   if (playerWon == false) {
        checkForWinningOptions();
        if (cpuWon == false) {
            checkForDanger();
            randomCpuMove();}
   }
   else{
    playerWins();
   }
}


function tied(){
    document.getElementById('end-tied').style.transform = "translateX(0)";
    document.getElementById('table-container').style.opacity = "0.8";
}


function playerWins(){
    fieldsFree = [];
    animateWinner('leaf', 'player', 'cpu', playerMoves, cpuMoves);
}


function cpuWins(){
    fieldsFree = [];
    animateWinner('fire', 'cpu', 'player', cpuMoves, playerMoves);
}


function animateWinner(icon, winner, loser, winnerMoves, loserMoves){
    changeWinningIcons(icon, winner, winnerMoves);
    fadeOutLoosersMoves(loser, loserMoves);
    fadeOutWinnrsotherMoves(winner, winnerMoves);
    document.getElementById('title-table').classList.add(`${icon}`);
    document.getElementById('play-titles').style.opacity = "0.8";
    document.getElementById(`end-${winner}-won`).style.transform = "translateX(0)";
}


function changeWinningIcons(icon, winner, winnerMoves){
    for (let i = 0; i < winnerMoves.length; i++) {
        const winicon = document.getElementById(`${winner}-${winnerMoves[i]}`);
        winicon.src = `icon/${icon}.png`;
    }
}


function fadeOutLoosersMoves(loser, loserMoves){
    for (let i = 0; i < loserMoves.length; i++) {
        loserfields = document.getElementById(`${loser}-${loserMoves[i]}`)
        loserfields.style.opacity = "0.4";
    }
}


function fadeOutWinnrsotherMoves(winner, winnerMoves){
    for (let i = 0; i < winnerMoves.length; i++) {
        if (winningFields.indexOf(winnerMoves[i]) == -1) {
            let otherWinnerFields = document.getElementById(`${winner}-${winnerMoves[i]}`);
            otherWinnerFields.style.opacity = "0.2";
        }        
    }
}



function checkForBadMoves(){
    playerMoves.sort();
    for (let i = 0; i < badMovePosition1.length; i++) {
        if ((playerMoves.includes(badMovePosition1[i]) == true) && (playerMoves.includes(badMovePosition2[i]) == true) && (fieldsFree.indexOf(badMoveReaction[i]) > -1)) {
            fillCpu(badMoveReaction[i]);
            danger = true;
            return;}
    }
}


function checkForDanger(){
    playerMoves.sort();
    for (let i = 0; i < dangerReaction.length; i++) {
        if ((playerMoves.includes(dangerPosition1[i]) == true) && (playerMoves.includes(dangerPosition2[i]) == true) && (fieldsFree.indexOf(dangerReaction[i]) > -1)) {
            fillCpu(dangerReaction[i]);
            danger = true;
            return;}  
    }
}


function checkForWinningOptions(){
    cpuMoves.sort();
    for (let i = 0; i < dangerReaction.length; i++) {
        if ((cpuMoves.includes(dangerPosition1[i]) == true) && (cpuMoves.includes(dangerPosition2[i]) == true) && (fieldsFree.indexOf(dangerReaction[i]) > -1)) {
            fillCpu(dangerReaction[i]);
            if (playerWon == false) {
                winningFields = [dangerPosition1[i], dangerPosition2[i], dangerReaction[i]];
            }
            cpuWon = true;
            return;}  
    }
}


function checkForPlayerWin(){
    for (let i = 0; i < dangerReaction.length; i++) {
        if ((playerMoves.includes(dangerPosition1[i]) == true) && (playerMoves.includes(dangerPosition2[i]) == true) && (playerMoves.includes(dangerReaction[i]))) {
            winningFields = [dangerPosition1[i], dangerPosition2[i], dangerReaction[i]]
            playerWon = true;
            return;}  
    }
}


function fillCpu(id){
    fields[id] = 'cpu';
    cpuMoves.push(id);
    removeOptions(id);
    document.getElementById('player-name-box').style.opacity = "0.3";
    document.getElementById('cpu-name-box').style.opacity = "1";
    setTimeout(() => {
        document.getElementById('player-name-box').style.opacity = "1";
        document.getElementById('cpu-name-box').style.opacity = "0.2";
        draw();
        if (cpuWon == true && playerWon == false) {
            sound.play();
        }
    }, 250);
}


function draw(){
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] == playerCharacter) {
            document.getElementById('player-'+i).src = `./icon/${playerCharacter}.png`;
            document.getElementById('player-'+i).classList.remove('d-none');
        }
        if (fields[i] == 'cpu') {
            document.getElementById('cpu-'+i).classList.remove('d-none');}
    }
}

//////////////////////////// start screen functions ////////////////////////

function playerMove(){
    distance1 += 2;
    distance2 += 2;
    document.getElementById('box1').style.transform = `translateY(${distance1}%)`;
    document.getElementById('box2').style.transform = `translateY(${distance2}%)`;
    if (distance1 > 8) {
        distance1 = -91;
    }
    if (distance2 > 8) {
        distance2 = -91;
    }
}


function choosePlayer(){
    clearInterval(interval);
    let random = Math.floor(Math.random() * 5)
    let box1 = document.getElementById('box1');
    let box2 = document.getElementById('box2');
    box1.style.transform = "translateY(0)";
    box2.style.transform = "translateY(0)";
    box1.src = `icon/${random}.png`;
    playerCharacter = random;
    box2.src = "icon/ring.png";
    document.getElementById('choose').disabled = `true`;
    document.getElementById('playername').innerHTML = `${names[random]}`;
    document.getElementById('cpu').innerHTML = `The Ring`;
    setTimeout(() => {
        startPlay();
    }, 900);
}


function start(){
    interval = setInterval(playerMove, 22);
}


function startPlay(){
    document.getElementById('start-screen').style.display = "none";
    document.getElementById('player-name-field').innerHTML = `${names[playerCharacter]}`;
    document.getElementById('player-image-field').src = `icon/${playerCharacter}.png`;
    document.getElementById('title-table').style.transform = "translateX(0)";

}