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

    drawMinotaur(ctx: CanvasRenderingContext2D, worldx: number, worldy: number, img: HTMLImageElement, width: number, height: number, dpr: number) {
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

            this.walkRandom(this.randomX - worldx, this.randomY - worldy, width, height, dpr);
        }
    }

    getRandom(min: number, max: number) {
        return Math.floor(Math.random() * max) + min;
        // return Math.floor(Math.random() * (max - min + 1)) + min;
    }

  
    walkRandom(worldx: number, worldy: number, width: number, height: number, dpr: number) {
        let speed = 10;
        // if (this.countRandom > 100 * this.getRandom(0, 8)) {
        //     this.directionRadom = this.getRandom(1, 100);
        //     this.countRandom = 0;
        // }



        if (this.directionRadom <= 25) {
            this.directionRadom = 74; // coloquei para ver se bate na arvore

            // if (!this.collision("right", 5, worldx, worldy, width, height, dpr)) {
            //     this.randomX = this.randomX + this.getRandom(0, speed);
            //     this.randomY = this.randomY + this.getRandom(0, 0);
            //     this.minotaurImageDirection = this.minotaurDirections.right.img;
            // } else {

            // }
        }
        else if (this.directionRadom <= 50) {
            this.directionRadom = 74; // coloquei para ver se bate na arvore

            // if (!this.collision("left", 5, worldx, worldy, width, height, dpr)) {
            //     this.randomX = this.randomX + this.getRandom((speed * (-1)), 0);
            //     this.randomY = this.randomY + this.getRandom(0, 0);
            //     this.minotaurImageDirection = this.minotaurDirections.left.img;
            // }
        }
        else if (this.directionRadom <= 75) {
            // if (!this.collision("down", 5, worldx, worldy, width, height, dpr)) {
            let x = this.randomX + this.getRandom(0, 0);
            let y = this.randomY + this.getRandom(0, speed);
            if (!this.collision("down", 3, worldx, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.down.img;
            } else {
                this.directionRadom = 100;
            }
            // }
        }
        else if (this.directionRadom >= 100) {
            let x = this.randomX + this.getRandom(0, 0);
            let y = this.randomY + (this.getRandom(0, speed )*(-1));
            if (!this.collision("up", 3, worldx, y, width, height, dpr)) {
                this.randomX = x;
                this.randomY = y;
                this.minotaurImageDirection = this.minotaurDirections.up.img;
            }
            else{
                this.directionRadom = 74;
            }
        }
        this.countRandom++;
    }


    collision(direction: string, futurePosition: number, worldx: number, worldy: number, width: number, height: number, dpr: number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (direction == "left") { left = futurePosition }
        if (direction == "right") { right = futurePosition; }
        if (direction == "up") { up = futurePosition; }
        if (direction == "down") { down = futurePosition; }


        return trees.some((e) => {
            // console.log("tre");
            // if ((e.x - worldx) > 0 && (e.x - worldx) < width
            //     && (e.y - worldy) > 0 && (e.y - worldy) < height) {


            // console.log("y  arvore" + (e.y - this.wY));
            // console.log("y  mintaur" +(worldy + (this.size)));
            // console.log("y  worldy" +(worldy ));
            if (
                // ((e.x - worldx) + e.size + this.size) >= ((width * dpr) / 2) - left
                //  (e.x - worldx) <= (((width * dpr) / 2) + this.size + right)
                //  ((e.y - worldy) + e.size) >= ((height * dpr) / 2) - up && 
                //  (e.y - worldy) <= (((height * dpr) / 2) + this.size + down)

                ((e.y - this.wY) + e.size) > ((worldy) - this.wY) &&
                (e.y - this.wY) < ((worldy + this.size) - this.wY)
            ) {
                return true;
            }
            // }
        });
    }


}