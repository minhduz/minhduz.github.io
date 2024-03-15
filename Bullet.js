export default class Bullet{
    // class này dùng để vẽ ra viên đạn với hình dáng và màu sắc
    constructor(canvas,x,y,velocity,bulletColor) {
        this.canvas = canvas;
        this.x = x;
        this.y = y;
        this.velocity = velocity
        this.bulletColor = bulletColor;

        this.width = 5;
        this.height = 10;
    }
    // method vẽ đạn và cho viên đã di chuyển lên phía trên
    // bằng cách giảm dần tọa độ của chúng
    draw(ctx) {
        this.y -= this.velocity
        ctx.fillStyle = this.bulletColor
        ctx.fillRect(this.x,this.y,this.width,this.height)
    }

    // Điều kiện chính xác (tọa độ) để viên đạn va chạm với 1 con ma
    collideWith(sprite){
        if(this.x + this.width > sprite.x &&
           this.x < sprite.x + sprite.width &&
           this.y + this.height > sprite.y &&
           this.y < sprite.y + sprite.height){
                return true
        } else {
            return false
        }
    }
}