import Enemy from "./Enemy.js";
import MovingDirection  from "./MovingDirection.js";

export default class EnemyController{
    // vị trí của dối thủ (1,2,3) ứng với enemy1,enemy2,enemy3
    enemyMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];
    // khai báo mảng số hàng đối thủ
    enemyRows = [];

    currenDirection = MovingDirection.right; // vị trí ban đầu
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    moveDownTimerDefault = 30; // thời gian di chuyển xuống mặc định
    moveDownTimer = this.moveDownTimerDefault
    fireBulletTimerDefault = 20
    fireBulletTimer = this.fireBulletTimerDefault

    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas
        this.enemyBulletController = enemyBulletController
        this.playerBulletController = playerBulletController

        this.enemyDeathSound = new Audio("sounds/enemy-death.wav")
        this.enemyDeathSound.volume = 0.5

        this.createEnemies()
    }
    // method vẽ địch tổng quát
    draw(ctx){
        this.decrementMoveDownTimer()
        this.updateVelocityAndDirection();
        this.collisionDetection();
        this.drawEnemies(ctx)
        this.resetMoveDownTimer()
        this.fireBullet()
    }

    // Method check va chạm với bullet
    // Khi hàm va chạm trả về true, thì con ma ở vị trí của viên đạn va chạm vào đó sẽ bị loại bỏ khỏi mảng yêu quái
    collisionDetection(){
        this.enemyRows.forEach(enemyRow => {
            enemyRow.forEach((enemy,enemyIndex) => {
                if(this.playerBulletController.collideWith(enemy)){
                    //play a sound
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play()
                    enemyRow.splice(enemyIndex,1)
                }
            })
        })

        this.enemyRows = this.enemyRows.filter((enemyRow) => enemyRow.length > 0)
    }

    //Hàm sử lý địch bắn đạn
    fireBullet(){
        this.fireBulletTimer--;
        if(this.fireBulletTimer <= 0){
            this.fireBulletTimer = this.fireBulletTimerDefault
            // Trải mảng 2 chiều thành mảng 1 chiều
            const allEnemies = this.enemyRows.flat();
            // Random phần tử yêu quái ở trong mảng
            const enemyIndex = Math.floor(Math.random() * allEnemies.length)
            const enemy = allEnemies[enemyIndex]
            // Gọi đến method shoot và chiều phần tử yêu quái đã được random chọn ra ở trên
            this.enemyBulletController.shoot(enemy.x+enemy.width/2-2.5,enemy.y,-3)

        }
    }
    // method reset thời than di chuyển xuống
    resetMoveDownTimer(){
        if(this.moveDownTimer <= 0){
            this.moveDownTimer = this.moveDownTimerDefault;
        }
    }

    // Method giảm dần thời gian di chuyển xuống
    decrementMoveDownTimer(){
        if(this.currenDirection === MovingDirection.downLeft ||
           this.currenDirection === MovingDirection.downRight
        ) {
            this.moveDownTimer--;
        }
    }
    // method cập nhật vị trí và hướng đi cho địch
    updateVelocityAndDirection(){
        for (const enemyRow of this.enemyRows){
            if (this.currenDirection === MovingDirection.right){
                this.xVelocity = this.defaultXVelocity
                this.yVelocity = 0;
                const rightMostEnemy = enemyRow[enemyRow.length -1]
                if (rightMostEnemy.x + rightMostEnemy.width >= this.canvas.width){
                    this.currenDirection = MovingDirection.downLeft
                    break;
                }
            } else if (this.currenDirection === MovingDirection.downLeft){
                if (this.moveDown(MovingDirection.left)){
                    break;
                }
            } else if (this.currenDirection === MovingDirection.left){
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const leftMostEnemy = enemyRow[0];
                if(leftMostEnemy.x <= 0) {
                    this.currenDirection = MovingDirection.downRight;
                    break;
                }
            } else if (this.currenDirection === MovingDirection.downRight) {
                if(this.moveDown(MovingDirection.right)) {
                    break;
                }
            }
        }
    }

    // method xử lý di chuyển xuống của địch
    moveDown(newDirection){
        // di chuyển xuống
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity
        // khi thời gian di chuyển xuống giảm xuống 0 thì hàm trả về true, không thì trả về false
        if(this.moveDownTimer <= 0){
            this.currenDirection = newDirection
            return true;
        }
        return false;
    }

    // method vẽ địch
    drawEnemies(ctx){
        this.enemyRows.flat().forEach((enemy) =>{
            enemy.move(this.xVelocity, this.yVelocity)
            enemy.draw(ctx)
        })
    }
    // method tạo ra địch (sử dụng foreach lồng để duyệt vị trí của địch)
    // Vòng foreach thứ nhất là duyệt hàng
    // Vòng foreach thứ hai là duyệt từng đối thủ có trong hàng
    createEnemies(){
        this.enemyMap.forEach((row,rowIndex) =>{
            this.enemyRows[rowIndex] = [];
            row.forEach((enemyNumber,enemyIndex)=>{
                // Điều kiện để địch có thể xuất hiện
                if(enemyNumber > 0){
                    this.enemyRows[rowIndex].push(
                        // lấy dữ liệu từ class Enemy
                        new Enemy(enemyIndex*50,rowIndex*35,enemyNumber))
                }
            })
        })
    }

    collideWith(sprite){
        return this.enemyRows.flat().some((enemy) => enemy.collideWith(sprite))
    }
}