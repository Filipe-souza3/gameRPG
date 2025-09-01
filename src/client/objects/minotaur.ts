import { Trees } from "./trees";

export class Minotaur {

    localImage = "../imgs/minotaur/";
    // img: string = this.localImage + "magic_field_blue.png";
    sizeSprite: number = 64;
    size: number = 64 + 30;

    frames: any = {
        move: [
            { y: 0, x: 0 },
            { y: 0, x: 64 },
            { y: 0, x: (64 * 2) },
            { y: 0, x: (64 * 3) },
            { y: 0, x: (64 * 4) },
            { y: 0, x: (64 * 5) },
            { y: 0, x: (64 * 6) },
            { y: 0, x: (64 * 7) }
        ],
        stop: [
            { y: 0, x: 0 }
        ]
    }
    maxFrames: number = 11;

    lastFrameTime: number = 0;
    frameDuration: number = 100;
    countFrames: number = 0;
    minotaurDirections: any = {
        up: { img: this.localImage + "minotaurMoveUp.png", frames: this.frames.move },
        down: { img: this.localImage + "minotaurMoveDown.png", frames: this.frames.move },
        left: { img: this.localImage + "minotaurMoveLeft.png", frames: this.frames.move },
        right: { img: this.localImage + "minotaurMoveRight.png", frames: this.frames.move },
        upStop: { img: this.localImage + "minotaurUp.png", frames: this.frames.stop },
        downStop: { img: this.localImage + "minotaurDown.png", frames: this.frames.stop },
        leftStop: { img: this.localImage + "minotaurLeft.png", frames: this.frames.stop },
        rightStop: { img: this.localImage + "minotaurRight.png", frames: this.frames.stop }
    }
    minotaurImageDirection: any = this.minotaurDirections.up.img;

    randomX: number = 100;
    randomY: number = 250;
    countRandom: number = 0;
    directionRadom: number = 74; //deixar 0 coloquei 74 para testes

    worldX: number = 0
    worldY: number = 0

    //class
    trees: Trees = new Trees();


    constructor() { }

    drawMinotaur(ctx: CanvasRenderingContext2D, worldx: number, worldy: number, img: HTMLImageElement, width: number, height: number, dpr: number) {
        let minotaurImg = img;
        minotaurImg.src = this.minotaurImageDirection;

        this.worldX = worldx;
        this.worldY = worldy;

        ctx.drawImage(minotaurImg,
            this.frames.move[this.countFrames % this.frames.move.length].x,
            this.frames.move[this.countFrames % this.frames.move.length].y,
            this.sizeSprite, this.sizeSprite,
            this.randomX - worldx, this.randomY - worldy,
            this.size, this.size);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.randomX - worldx, this.randomY - worldy, this.size, this.size);

        if (new Date().getTime() - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = new Date().getTime();

            this.walkRandom(width, height, dpr);
        }
    }

    private getRandom(min: number, max: number) {
        return Math.floor(Math.random() * max) + min;
        // return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    private walkRandom(width: number, height: number, dpr: number) {
        let speed = 15;
        // if (this.countRandom > 100 * this.getRandom(0, 8)) {
        //     this.directionRadom = this.getRandom(1, 100);
        //     this.countRandom = 0;
        // }

        if (this.directionRadom <= 25) {
            let x = this.randomX + this.getRandom(0, speed);
            let y = this.randomY + this.getRandom(0, 0);
            if (!this.collision("right", 3, x, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.right.img;
            } else {
                this.otherDirection();
            }

            // this.directionRadom = 70;
        }
        else if (this.directionRadom <= 50) {
            let x = this.randomX + (this.getRandom(0, speed) * (-1));
            let y = this.randomY + this.getRandom(0, 0);
            if (!this.collision("left", 3, x, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.left.img;
            } else {
                this.otherDirection();
            }
            // this.directionRadom = 70;
        }
        else if (this.directionRadom <= 75) {
            let x = this.randomX + this.getRandom(0, 0);
            let y = this.randomY + this.getRandom(0, speed);
            if (!this.collision("down", 3, x, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.down.img;
            } else {
                // this.directionRadom = 76;
                this.otherDirection();
            }

        }
        else if (this.directionRadom > 75) {
            let x = this.randomX + this.getRandom(0, 0);
            let y = this.randomY + (this.getRandom(0, speed) * (-1));
            if (!this.collision("up", 3, x, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.up.img;
            }
            else {
                this.otherDirection();
                // this.directionRadom = 70;
            }
        }
        this.countRandom++;
    }

    followPlayer(){
        
    }


    private collision(direction: string, futurePosition: number, x: number, y: number, width: number, height: number, dpr: number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (direction == "left") { left = futurePosition }
        if (direction == "right") { right = futurePosition; }
        if (direction == "up") { up = futurePosition; }
        if (direction == "down") { down = futurePosition; }

        let collisionTrees = this.trees.allTrees.some((e) => {

            // if ((e.x - worldx) > 0 && (e.x - worldx) < width
            //     && (e.y - worldy) > 0 && (e.y - worldy) < height) {

            if (((e.x - this.worldX) + e.size) > (x - this.worldX) &&
                (e.x - this.worldX) < ((x + this.size) - this.worldX) &&
                ((e.y - this.worldY) + e.size) > (y - this.worldY) &&
                (e.y - this.worldY) < ((y + this.size) - this.worldY)) {
                return true;
            }
            // }
        });


        //o 32 e metade do player, dps ver ocmo trazer valor
        let colissionPlayer = (
            ((width * dpr) / 2) - 32) < ((x - this.worldX) + this.size) &&
            (((width * dpr) / 2) + 32) > (x - this.worldX) &&
            (((height * dpr) / 2) - 32) < ((y - this.worldY) + this.size) &&
            (((height * dpr) / 2) + 32) > (y - this.worldY);

        return collisionTrees || colissionPlayer;
    }

    private otherDirection() {
        let direction = this.getRandom(1, 4);

        switch (direction) {
            case 1:
                this.directionRadom = 0;
                break;
            case 2:
                this.directionRadom = 30;
                break;
            case 3:
                this.directionRadom = 60;
                break;
            default:
                this.directionRadom = 90;
                break;
        }
    }


}