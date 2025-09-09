import { Player } from "./player";
import { Trees } from "./trees";

export class Minotaur {

    localImage = "../imgs/minotaur/";
    // img: string = this.localImage + "magic_field_blue.png";
    sizeSprite: number = 64;
    size: number = 64 + 30;
    speed: number = 15;
    radius: number = 500;
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
    frameDuration: number = 150;
    countFrames: number = 0;
    allMinotaurDirections: any = {
        up: { img: this.localImage + "minotaurMoveUp.png", frames: this.frames.move },
        down: { img: this.localImage + "minotaurMoveDown.png", frames: this.frames.move },
        left: { img: this.localImage + "minotaurMoveLeft.png", frames: this.frames.move },
        right: { img: this.localImage + "minotaurMoveRight.png", frames: this.frames.move },
        upStop: { img: this.localImage + "minotaurUp.png", frames: this.frames.stop },
        downStop: { img: this.localImage + "minotaurDown.png", frames: this.frames.stop },
        leftStop: { img: this.localImage + "minotaurLeft.png", frames: this.frames.stop },
        rightStop: { img: this.localImage + "minotaurRight.png", frames: this.frames.stop }
    }
    minotaurDirection: any = this.allMinotaurDirections.up;

    randomX: number = 100;
    randomY: number = 250;
    directions: any = { up: "up", down: "down", left: "left", right: "right" }
    countRandom: number = 0;
    directionRadom: string = this.directions.up; //deixar 0 coloquei 74 para testes

    lastTimeWalkRandom: number = 0;
    lastMovimentStop: boolean = true;
    futurePosition: number = 10;

    ctx?: any; // usado para este ver radio de ataque e direçao //deletar

    worldX: number = 0
    worldY: number = 0

    //class
    trees: Trees = new Trees();
    player: Player = new Player();

    constructor() { }

    drawMinotaur(ctx: CanvasRenderingContext2D, worldx: number, worldy: number, img: HTMLImageElement, width: number, height: number, dpr: number): void {
        let minotaurImg = img;
        minotaurImg.src = this.minotaurDirection.img;

        this.worldX = worldx;
        this.worldY = worldy;
        this.ctx = ctx; //deletar

        ctx.drawImage(minotaurImg,
            this.minotaurDirection.frames[this.countFrames % this.minotaurDirection.frames.length].x,
            this.minotaurDirection.frames[this.countFrames % this.minotaurDirection.frames.length].y,
            this.sizeSprite, this.sizeSprite,
            this.randomX - worldx, this.randomY - worldy,
            this.size, this.size);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.randomX - worldx, this.randomY - worldy, this.size, this.size);

        let now = new Date().getTime();
        if (now - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = now;

            this.walkRandom(worldx, worldy, width, height, dpr);
        }
    }


    private walkRandom(worldx: number, worldy: number, width: number, height: number, dpr: number): void {

        let rand = this.getRandom(1, 4)
        if (this.countRandom > 20 * rand) {

            let now = new Date().getTime();
            if ((now - this.lastTimeWalkRandom > 2000)) {
                this.lastTimeWalkRandom = now;
                this.minotaurDirection = this.allMinotaurDirections[this.directionRadom + "Stop"];
                this.lastMovimentStop = !this.lastMovimentStop;
                this.directionRadom = "";
            }

            if (this.lastMovimentStop) {
                this.directionRadom = this.randomDirection();
                this.minotaurDirection = this.allMinotaurDirections[this.directionRadom];
                this.countRandom = 0;
            }
        }

        if (!this.followPlayer(worldx, worldy, width, height, dpr)) {
            if (this.directionRadom == this.directions.right) {
                let x = this.randomX + this.getRandom(0, this.speed);
                let y = this.randomY + this.getRandom(0, 0);
                if (!this.collision(this.directions.right, this.futurePosition, x, y, width, height, dpr)) {
                    this.randomX = x;
                    this.randomY = y;
                    this.minotaurDirection = this.allMinotaurDirections.right;
                } else {
                    this.directionRadom = this.randomDirection();
                }
            }
            else if (this.directionRadom == this.directions.left) {
                let x = this.randomX + (this.getRandom(0, this.speed) * (-1));
                let y = this.randomY + this.getRandom(0, 0);
                if (!this.collision(this.directions.left, this.futurePosition, x, y, width, height, dpr)) {
                    this.randomX = x;
                    this.randomY = y;
                    this.minotaurDirection = this.allMinotaurDirections.left;
                } else {
                    this.directionRadom = this.randomDirection();
                }
            }
            else if (this.directionRadom == this.directions.down) {
                let x = this.randomX + this.getRandom(0, 0);
                let y = this.randomY + this.getRandom(0, this.speed);
                if (!this.collision(this.directions.down, this.futurePosition, x, y, width, height, dpr)) {
                    this.randomX = x;
                    this.randomY = y;
                    this.minotaurDirection = this.allMinotaurDirections.down;
                } else {
                    this.directionRadom = this.randomDirection();
                }

            }
            else if (this.directionRadom == this.directions.up) {
                let x = this.randomX + this.getRandom(0, 0);
                let y = this.randomY + (this.getRandom(0, this.speed) * (-1));
                if (!this.collision(this.directions.up, this.futurePosition, x, y, width, height, dpr)) {
                    this.randomX = x;
                    this.randomY = y;
                    this.minotaurDirection = this.allMinotaurDirections.up;
                }
                else {
                    this.directionRadom = this.randomDirection();
                }
            }
            this.countRandom++;
        }
    }

    changeDirectionOnCollision: boolean = true;
    directionOnCollision: string = "down";
    followPlayer(worldx: number, worldy: number, width: number, height: number, dpr: number): boolean {

        let x = this.randomX - worldx;
        let y = this.randomY - worldy;
        let px = ((width * dpr) / 2);
        let py = ((height * dpr) / 2);
        let norm = { x: 0, y: 0 };
        let halfSize = this.size / 2;


        //linha ataque
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(x + halfSize, y + halfSize);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        //raio de ataque
        this.ctx.beginPath();
        this.ctx.arc((x + halfSize), (y + halfSize), this.radius, 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        if (x > ((this.size * 0.8) * (-1)) && x < width
            && y > ((this.size * 0.8) * (-1)) && y < height) {

            let dx = px - (x + halfSize);
            let dy = py - (y + halfSize);
            let length = Math.hypot(dx, dy);

            if (length < this.radius) {

                if (length === 0) {
                    norm = { x: 0, y: 0 }
                } else {
                    norm = { x: (dx / length), y: (dy / length) };
                }

                console.log(length);
                console.log(this.followPlayerDirection(x, y, px, py));
                let direction = this.followPlayerDirection(x, y, px, py);
                if (!this.collision(direction, 20, this.randomX, this.randomY, width, height, dpr)) {
                    this.directionOnCollision = direction;
                    // if (length > 100) {
                    if (direction == this.directions.left || direction == this.directions.right) {
                        direction == this.directions.left ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
                        this.randomX += (norm.x * this.speed);
                    } else {
                        direction == this.directions.up ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
                        this.randomY += (norm.y * this.speed);
                    }
                    // if (Math.abs(x - px) > Math.abs(y - py)) {
                    //     x > px ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
                    //     this.randomX += (norm.x * this.speed);
                    // } else {
                    //     y > py ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
                    //     this.randomY += (norm.y * this.speed);
                    // }
                    this.changeDirectionOnCollision = true;
                    console.log("sem colisao");
                } else {

                    let t = true;

                    // while(t){
                    //     if (this.collision(this.directionOnCollision,20, this.randomX, this.randomY, width, height, dpr)) {
                    //         this.directionOnCollision = this.otherDirectionHunt(direction);
                    //     }else{
                    //         t= false;
                    //     }
                    // }

                    if (this.changeDirectionOnCollision) {
                        this.directionOnCollision = this.otherDirectionHunt(direction);
                        direction = this.directionOnCollision;
                        this.changeDirectionOnCollision = false;
                    }
                    if (this.collision(this.directionOnCollision, 10, this.randomX, this.randomY, width, height, dpr)) {
 this.directionOnCollision = this.otherDirectionHunt(direction);
                    }
                    direction = this.directionOnCollision;


                    // let max = 4;
                    // let count = 0;
                    // if (this.collision(this.directionOnCollision, 20, this.randomX, this.randomY, width, height, dpr) ) {
                    //     this.directionOnCollision = this.otherDirectionHunt(this.directionOnCollision);
                    //     direction = this.directionOnCollision;
                    //     // count++;
                    // }


                    if (direction == this.directions.left || direction == this.directions.right) {
                        direction == this.directions.left ? norm.x = -1 : norm.x = 1;
                        direction == this.directions.left ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
                        this.randomX += (norm.x * this.speed);
                    } else {
                        direction == this.directions.up ? norm.y = -1 : norm.y = 1;
                        direction == this.directions.up ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
                        this.randomY += (norm.y * this.speed);
                    }



                    // console.log("colisao");
                    // if(this.changeDirectionOnCollision){
                    //     this.directionOnCollision = this.otherDirectionHunt(direction);
                    //     this.changeDirectionOnCollision = false;
                    // }
                    // direction = this.directionOnCollision;
                    // // this.directionRadom = this.otherDirectionHunt(direction);
                    // console.log(this.directionRadom);
                    // if (direction == this.directions.left || direction == this.directions.right) {
                    //     direction == this.directions.left ? norm.x = -1 : norm.x = 1;
                    //     direction == this.directions.left ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
                    //     this.randomX += (norm.x * this.speed);
                    // } else {
                    //     direction == this.directions.up ? norm.y = -1 : norm.y = 1;
                    //     direction == this.directions.up ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
                    //     this.randomY += (norm.y * this.speed);
                    // }


                    // console.log("");
                    // this.directionRadom = this.otherDirection();
                }
                return true;
            }
        }
        return false;
    }

    private followPlayerDirection(x: number, y: number, px: number, py: number): string {
        if (Math.abs(x - px) > Math.abs(y - py)) {
            if ((x - px) > 0) {
                return this.directions.left;
            } else {
                return this.directions.right;
            }
        } else {
            if ((y - py) > 0) {
                return this.directions.up;
            } else {
                return this.directions.down;
            }
        }
    }


    private collision(direction: string, futurePosition: number, x: number, y: number, width: number, height: number, dpr: number): boolean {
        let left = 0, right = 0, up = 0, down = 0;
        if (direction == this.directions.left) { left = futurePosition; }
        if (direction == this.directions.right) { right = futurePosition; }
        if (direction == this.directions.up) { up = futurePosition; }
        if (direction == this.directions.down) { down = futurePosition; }

        let collisionTrees = this.trees.allTrees.some((e) => {

            // if ((e.x - worldx) > 0 && (e.x - worldx) < width
            //     && (e.y - worldy) > 0 && (e.y - worldy) < height) {

            if (((e.x - this.worldX) + e.size) > ((x - this.worldX) - left) &&
                (e.x - this.worldX) < (((x + this.size) - this.worldX) + right) &&
                ((e.y - this.worldY) + e.size) > ((y - this.worldY) - up) &&
                (e.y - this.worldY) < (((y + this.size) - this.worldY) + down)) {
                return true;
            }
            // }
        });

        return collisionTrees;

        // //o 32 e metade do player, dps ver ocmo trazer valor
        // let colissionPlayer = (
        //     ((width * dpr) / 2) - (this.player.size / 2)) < ((x - this.worldX) + this.size) &&
        //     (((width * dpr) / 2) + (this.player.size / 2)) > (x - this.worldX) &&
        //     (((height * dpr) / 2) - (this.player.size / 2)) < ((y - this.worldY) + this.size) &&
        //     (((height * dpr) / 2) + (this.player.size / 2)) > (y - this.worldY);

        // return collisionTrees || colissionPlayer;
    }

    private collisionPlayer(width: number, height: number, x: number, y: number, dpr: number): boolean {
        return (((width * dpr) / 2) - (this.player.size / 2)) < ((x - this.worldX) + this.size) &&
            (((width * dpr) / 2) + (this.player.size / 2)) > (x - this.worldX) &&
            (((height * dpr) / 2) - (this.player.size / 2)) < ((y - this.worldY) + this.size) &&
            (((height * dpr) / 2) + (this.player.size / 2)) > (y - this.worldY);
    }

    private getRandom(min: number, max: number, mult?: number): number {
        let result = Math.floor(Math.random() * max) + min;
        if (mult) result = result * mult;
        return result;
        // return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randomDirection(): string {
        let direction = this.getRandom(1, 100);
        if (direction <= 25 && direction >= 0) { return this.directions.right }
        else if (direction <= 50) { return this.directions.left }
        else if (direction <= 75) { return this.directions.down }
        else if (direction > 75) { return this.directions.up }
        return this.directions.down;
    }

    private otherDirectionHunt(direction: string): string {

        let xDirection = [this.directions.left, this.directions.right];
        let yDirection = [this.directions.up, this.directions.down];
        let numberDirection = this.getRandom(0, 50);
        if (direction == this.directions.up) { return xDirection[numberDirection < 25 ? 0 : 1]; }
        else if (direction == this.directions.down) { return xDirection[numberDirection < 25 ? 0 : 1]; }
        else if (direction == this.directions.left) { return yDirection[numberDirection < 25 ? 0 : 1]; }
        else { return yDirection[numberDirection < 25 ? 0 : 1]; }
    }

}