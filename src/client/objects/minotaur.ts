import { trees } from './trees';


export class Minotaur {

    localField = "./imgs/minotaur/";
    img: string = this.localField + "magic_field_blue.png";
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
        up: { img: this.localField + "minotaurMoveUp.png", frames: this.frames.move },
        down: { img: this.localField + "minotaurMoveDown.png", frames: this.frames.move },
        left: { img: this.localField + "minotaurMoveLeft.png", frames: this.frames.move },
        right: { img: this.localField + "minotaurMoveRight.png", frames: this.frames.move },
        upStop: { img: this.localField + "minotaurUp.png", frames: this.frames.stop },
        downStop: { img: this.localField + "minotaurDown.png", frames: this.frames.stop },
        leftStop: { img: this.localField + "minotaurLeft.png", frames: this.frames.stop },
        rightStop: { img: this.localField + "minotaurRight.png", frames: this.frames.stop }
    }
    minotaurImageDirection: any = this.minotaurDirections.up.img;

    randomX: number = 100;
    randomY: number = 250;
    countRandom: number = 0;
    directionRadom: number = 74; //deixar 0 coloquei 74 para testes

    wX: number = 0
    wY: number = 0


    constructor() { }

    drawMinotaur(ctx: CanvasRenderingContext2D, worldx: number, worldy: number, img: HTMLImageElement, width:number, height:number, dpr:number) {
        let minotaurImg = img;
        minotaurImg.src = this.minotaurImageDirection;

        this.wX = worldx;
        this.wY = worldy;

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


    private walkRandom(width:number, height:number, dpr:number) {
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
            } else { this.directionRadom = 30; }

        }
        else if (this.directionRadom <= 50) {
            let x = this.randomX + (this.getRandom(0, speed) * (-1));
            let y = this.randomY + this.getRandom(0, 0);
            if (!this.collision("left", 3, x, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.left.img;
            } else { this.directionRadom = 24; }
        }
        else if (this.directionRadom <= 75) {
            // let x = this.randomX + this.getRandom(0, 0);
            // let y = this.randomY + this.getRandom(0, speed);
            // if (!this.collision("down", 3, x, y, width, height, dpr)) {
            //     this.randomX = x;
            //     this.randomY = y;
            //     this.minotaurImageDirection = this.minotaurDirections.down.img;
            // } else {
            this.directionRadom = 24;
            // }

        }
        else if (this.directionRadom >= 100) {
            // let x = this.randomX + this.getRandom(0, 0);
            // let y = this.randomY + (this.getRandom(0, speed )*(-1));
            // if (!this.collision("up", 3, worldx, y, width, height, dpr)) {
            //     this.randomX = x;
            //     this.randomY = y;
            //     this.minotaurImageDirection = this.minotaurDirections.up.img;
            // }
            // else{
            this.directionRadom = 24;
            // }
        }
        this.countRandom++;
    }


    private collision(direction: string, futurePosition: number, worldx: number, worldy: number, width:number, height:number, dpr:number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (direction == "left") { left = futurePosition }
        if (direction == "right") { right = futurePosition; }
        if (direction == "up") { up = futurePosition; }
        if (direction == "down") { down = futurePosition; }

        let collisionTrees =  trees.some((e) => {

            // if ((e.x - worldx) > 0 && (e.x - worldx) < width
            //     && (e.y - worldy) > 0 && (e.y - worldy) < height) {

            if (((e.x - this.wX) + e.size) > ((worldx) - this.wX) &&
                (e.x - this.wX) < ((worldx + this.size) - this.wX) &&
                ((e.y - this.wY) + e.size) > ((worldy) - this.wY) &&
                (e.y - this.wY) < ((worldy + this.size) - this.wY)) {
                return true;
            }
            // }
        });


        //o 32 e metade do player, dps ver ocmo trazer valor
        let colissionPlayer = (
            ((width * dpr) / 2) - 32) < ((worldx - this.wX) + this.size) &&
            (((width * dpr) / 2) + 32) > (worldx - this.wX) && 
            (((height * dpr) / 2) - 32) < ((worldy - this.wY) + this.size) &&
            (((height * dpr) / 2) + 32) > (worldy - this.wY);

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