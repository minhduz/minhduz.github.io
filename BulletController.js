import Bullet from "./Bullet.js";

export default class BulletController {

    bullets = [] // Mảng lưu đối tượng đạn
    timeTillNextBulletAllowed = 0;

    constructor(canvas,maxBulletsAtATime,bulletColor,soundEnabled) {
        this.canvas = canvas
        this.maxBulletsAtATime = maxBulletsAtATime // Số đạn lớn nhất ở một thời điểm
        this.bulletColor = bulletColor // Màu đạn
        this.soundEnabled = soundEnabled // Biến dùng để check khi viên đạn được tạo ra thì cũng phát ra audio tương ứng

        this.shootSound = new Audio("sounds/shoot.wav") // Audio đạn bắn
        this.shootSound.volume = 0.5;
    }

    // method dùng để vẽ đạn
    draw(ctx){
        // loại bỏ phần tử bullet ở trong mảng bullets khi phẩn tử đó đi ra khỏi màn hình
        this.bullets = this.bullets.filter(bullet => bullet.y + bullet.width >= 0
            && bullet.y <= this.canvas.height)
        // Khi mảng bullets có phần tử, vòng lặp foreach sẽ đc thực hiện và vẽ ra số đạn đã đc thêm vào bằng method shoot ở dưới
        this.bullets.forEach((bullet) => bullet.draw(ctx))
        // Thời gian delay giữa 2 viên đạn sẽ giảm dần
        if(this.timeTillNextBulletAllowed > 0){
            this.timeTillNextBulletAllowed--;
        }

    }

    //check xem có viên đạn nào chạm vào con ma ở vị trí đó hay ko
    collideWith(sprite){
        const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) =>
        bullet.collideWith(sprite));
        // Nếu tồn tại viên đạn va chạm với con ma thì viên đã đó sẽ bị loại bỏ khỏi mảng bullets (biến mất chứ không đi lên hết màn hình nữa)
        if(bulletThatHitSpriteIndex >= 0){
            this.bullets.splice(bulletThatHitSpriteIndex,1)
            return true
        }

        return false
    }

    shoot(x,y,velocity,timeTillNextBulletAllowed = 0) {
        //Nếu thời gian delay bằng O và số đạn đã bắn không vượt quá số đạn lớn nhất ở 1 thời điểm
        //thì cho phép tạo ra viên đạn
        if(
            this.timeTillNextBulletAllowed === 0 &&
            this.bullets.length < this.maxBulletsAtATime
        ) {
            const bullet = new Bullet(this.canvas,x,y,velocity,this.bulletColor)
            this.bullets.push(bullet)
            // Điền kiện phát ra âm thanh bắn đạn
            if(this.soundEnabled) {
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }
            // Sau khi bắn 1 viên, thời gian delay sẽ đc reset về ban đầu để chờ viên tiếp theo đc bắn
            this.timeTillNextBulletAllowed = timeTillNextBulletAllowed
        }
    }
}