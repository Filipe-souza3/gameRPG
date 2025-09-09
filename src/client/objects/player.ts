import { Trees } from "./trees";


export class Player {

    private id?: number;
    localImage: string = "../imgs/citizen/";
    size: number = 64;
    speed = 1//0.5;
    marginCollision: number = 5;
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
    };
    countFrames: number = 0;
    frameDuration: number = 100;
    lastFrameTime: number = 0;

    directions: any = {
        up: { img: this.localImage + "CitizenMaleMoveUp.png", frames: this.frames.move },
        down: { img: this.localImage + "CitizenMaleMoveDown.png", frames: this.frames.move },
        left: { img: this.localImage + "CitizenMaleMoveLeft.png", frames: this.frames.move },
        right: { img: this.localImage + "CitizenMaleMoveRight.png", frames: this.frames.move },
        upStop: { img: this.localImage + 'CitizenMaleUp.png', frames: this.frames.stop },
        downStop: { img: this.localImage + 'CitizenMaleDown.png', frames: this.frames.stop },
        leftStop: { img: this.localImage + 'CitizenMaleLeft.png', frames: this.frames.stop },
        rightStop: { img: this.localImage + 'CitizenMaleRight.png', frames: this.frames.stop },
    }
    direction: any = this.directions.downStop;

    //keys
    keys: any = {};
    pressedLastKey: string = "";
    delayKeyPress: number = 10;
    lastKeyPress: number = 0;
    arrowKeys: any = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    }

    //class
    trees: Trees = new Trees();

    constructor() {

    }


    drawPlayer(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number, dpr: number) {
        let playerImg = img;
        playerImg.src = this.direction.img;
        ctx.drawImage(
            playerImg,
            this.direction.frames[this.countFrames % this.direction.frames.length].x, this.direction.frames[this.countFrames % this.direction.frames.length].y,
            64, 64,
            ((width * dpr) / 2) - (this.size / 2), ((height * dpr) / 2) - (this.size / 2),
            this.size, this.size);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(((width * dpr) / 2) - (this.size / 2), ((height * dpr) / 2) - (this.size / 2), this.size, this.size);

        if (this.countFrames >= 8) { this.countFrames = 0 }

        if (new Date().getTime() - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = new Date().getTime();
        }

    }

    move(keys: any, world: any, width: number, height: number, dpr: number, minotaurx: number, minotaury: number, minotaurSize: number) {

        if (Object.keys(keys).length > 0) {
            // console.log(this.keys);
            if (keys[this.arrowKeys.up] && !(this.collision(this.arrowKeys.up, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize))) {
                world.y -= this.speed;
                // this.imageDirection = this.directions.up.img;
                this.direction = this.directions.up;
                this.pressedLastKey = this.arrowKeys.up;
            }
            else if (keys[this.arrowKeys.left] && !(this.collision(this.arrowKeys.left, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize))) {
                world.x -= this.speed;
                // this.imageDirection = this.directions.left.img;
                this.direction = this.directions.left;
                this.pressedLastKey = this.arrowKeys.left;
            }
            else if (keys[this.arrowKeys.down] && !this.collision(this.arrowKeys.down, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize)) {
                world.y += this.speed;
                // this.imageDirection = this.directions.down.img;
                this.direction = this.directions.down;
                this.pressedLastKey = this.arrowKeys.down;
            }
            else if (keys[this.arrowKeys.right] && !this.collision(this.arrowKeys.right, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize)) {
                world.x += this.speed;
                // this.imageDirection = this.directions.right.img;
                this.direction = this.directions.right;
                this.pressedLastKey = this.arrowKeys.right;
            }
            // else if (this.keys.some((s:boolean)=> s == true)) {
            else if (this.collision(this.pressedLastKey, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize)) {
                if (this.pressedLastKey == this.arrowKeys.left) {
                    // this.imageDirection = this.directions.leftStop.img;
                    this.direction = this.directions.leftStop;
                }
                else if (this.pressedLastKey == this.arrowKeys.right) {
                    // this.imageDirection = this.directions.rightStop.img;
                    this.direction = this.directions.rightStop;
                }
                else if (this.pressedLastKey == this.arrowKeys.up) {
                    // this.imageDirection = this.directions.upStop.img;
                    this.direction = this.directions.upStop;
                }
                else if (this.pressedLastKey == this.arrowKeys.down) {
                    // this.imageDirection = this.directions.downStop.img;
                    this.direction = this.directions.downStop;
                }

            }
        }
    }

    collision(key: string, futurePosition: number, worldx: number, worldy: number, width: number, height: number, dpr: number, minotaurx: number, minotaury: number, minotaurSize: number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (key == this.arrowKeys.left) { left = futurePosition }
        if (key == this.arrowKeys.right) { right = futurePosition; }
        if (key == this.arrowKeys.up) { up = futurePosition; }
        if (key == this.arrowKeys.down) { down = futurePosition; }
        let halfPlayer = this.size / 2;

        let collisionTrees = this.trees.allTrees.some((e) => {

            if ((e.x - worldx) > 0 && (e.x - worldx) < width
                && (e.y - worldy) > 0 && (e.y - worldy) < height) {

                if (((e.x - worldx) + e.size + halfPlayer) >= ((width * dpr) / 2) - left
                    && (e.x - worldx) <= (((width * dpr) / 2) + halfPlayer + right)
                    && ((e.y - worldy) + e.size + halfPlayer) >= ((height * dpr) / 2) - up
                    && (e.y - worldy) <= (((height * dpr) / 2) + halfPlayer + down)) {

                    return true;
                }
            }
        });

        let colisionMinotaur =
            (((width * dpr) / 2) - halfPlayer) - left < ((minotaurx - worldx) + minotaurSize) &&
            (((width * dpr) / 2) + halfPlayer) + right > (minotaurx - worldx) &&
            (((height * dpr) / 2) - halfPlayer) + down < ((minotaury - worldy) + minotaurSize) &&
            (((height * dpr) / 2) + halfPlayer) - up > (minotaury - worldy);

        return collisionTrees || colisionMinotaur;
    }

    stop(keys: any) {
        if (!keys[this.arrowKeys.up] && !keys[this.arrowKeys.down] && !keys[this.arrowKeys.left] && !keys[this.arrowKeys.right]) {
            if (this.pressedLastKey == this.arrowKeys.up) {
                // this.imageDirection = this.directions.upStop.img; 
                this.direction = this.directions.upStop;
            }
            if (this.pressedLastKey == this.arrowKeys.down) {
                // this.imageDirection = this.directions.downStop.img; 
                this.direction = this.directions.downStop;
            }
            if (this.pressedLastKey == this.arrowKeys.left) {
                // this.imageDirection = this.directions.leftStop.img; 
                this.direction = this.directions.leftStop;
            }
            if (this.pressedLastKey == this.arrowKeys.right) {
                // this.imageDirection = this.directions.rightStop.img; 
                this.direction = this.directions.rightStop;
            }
        }
    }

    setId(value: number) {
        if (value) {
            this.id = value;
        }
    }

    getId() {
        return this.id;
    }


}