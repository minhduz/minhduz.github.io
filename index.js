import EnemyController from "./EnemyController.js"; // import dùng để lấy được dữ liệu từ class EnemyController ở EnemyController.js
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const displayPlayerLives = document.getElementById('playerLives')

canvas.width = 600
canvas.height = 600

const background = new Image()
background.src = "images/space.png"

const loseSound = new Audio("sounds/lose.mp3")
const winSound = new Audio("sounds/win.mp3")
const resurrectionSound = new Audio("sounds/resurrection.mp3")

const playerBulletController = new BulletController(canvas,10,"red",true)
const enemyBulletController = new BulletController(canvas,4,"white",false)
const enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController
);



const player = new Player(canvas, 3, playerBulletController)

let isGameOver = false;
let didWin = false;
let playerLives = 3;


function game(){
    checkGameOver();
    ctx.drawImage(background,0,0,canvas.width,canvas.height)
    displayGameOver();

    if(!isGameOver) {
        enemyController.draw(ctx)
        player.draw(ctx)
        playerBulletController.draw(ctx)
        enemyBulletController.draw(ctx)
    }
}

function displayGameOver(){
    if(isGameOver) {
        let text;
        if (didWin){
            text = "You Win"
            winSound.play()
            clearInterval(myInterval)
        } else {
            text = "You Lose"
            loseSound.play()
            clearInterval(myInterval)
        }

        let textOffset = didWin ? 3.5 : 5

        ctx.fillStyle = "white";
        ctx.font = '70px Arial'
        ctx.fillText(text,canvas.width / textOffset, canvas.height / 2)

    }

}

function checkGameOver(){
    if(enemyBulletController.collideWith(player)){
        player.currentHealth -= player.healLossPerHit
        console.log(player.currentHealth)
    }

    if(player.currentHealth === 0 ){
        playerLives--
        player.x = player.canvas.width/2 - 25
        player.y = player.canvas.height - 75
        player.width = 50
        player.height = 48
        player.currentHealth = player.maxHealth
        if (playerLives > 0){
            resurrectionSound.play()
        }
    }

    displayPlayerLives.innerText = `Lives: ${playerLives}`

    if(playerLives === 0 || enemyController.collideWith(player)){
        isGameOver = true

    } else {
        isGameOver = false
    }

    if(enemyController.enemyRows.length === 0){
        didWin = true;
        isGameOver = true
    }
}

const myInterval = setInterval(game,1000/60);