import { Player } from "./player";
import { Trees } from "./trees";

export class Minotaur {

    scale: number = 64;
    localImage = "../imgs/minotaur/";
    sizeSprite: number = this.scale;
    size: any = { x: this.scale, y: this.scale };
    locationMinotaur: any = { x: 6, y: 5 };

    radius: number = 10;
    frames: any = {
        move: [
            { y: 0, x: 0 },
            { y: 0, x: (1 * this.scale) },
            { y: 0, x: (2 * this.scale) },
            { y: 0, x: (3 * this.scale) },
            { y: 0, x: (4 * this.scale) },
            { y: 0, x: (5 * this.scale) },
            { y: 0, x: (6 * this.scale) },
            { y: 0, x: (7 * this.scale) }
        ],
        stop: [
            { y: 0, x: 0 }
        ]
    }
    maxFrames: number = 11;

    //velocidade frames animacao
    frameDuration: number = 80;
    lastFrameTime: number = 0;
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

    randomX: number = this.locationMinotaur.x * this.scale;
    randomY: number = this.locationMinotaur.y * this.scale;
    directions: any = { up: "up", down: "down", left: "left", right: "right" }
    countRandom: number = 0;
    directionRadom: string = this.directions.left;

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

    drawMinotaur(ctx: CanvasRenderingContext2D, world: any, img: HTMLImageElement, width: number, height: number, dpr: number): void {
        let minotaurImg = img;
        minotaurImg.src = this.minotaurDirection.img;

        this.worldX = world.x;
        this.worldY = world.y;
        this.ctx = ctx; //deletar

        ctx.drawImage(minotaurImg,
            this.minotaurDirection.frames[this.countFrames % this.minotaurDirection.frames.length].x + 8,
            this.minotaurDirection.frames[this.countFrames % this.minotaurDirection.frames.length].y + 8,
            this.size.x - 16, this.size.y - 16,
            this.randomX - world.x, this.randomY - world.y,
            this.size.x, this.size.y);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.randomX - world.x, this.randomY - world.y, this.size.x, this.size.y);

        let now = new Date().getTime();
        if (now - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = now;

        }
        this.walkRandom(world, width, height, dpr);
    }

    // drawMinotaur(ctx: CanvasRenderingContext2D, worldx: number, worldy: number, img: HTMLImageElement, width: number, height: number, dpr: number): void {
    //     let minotaurImg = img;
    //     minotaurImg.src = this.minotaurDirection.img;

    //     this.worldX = worldx;
    //     this.worldY = worldy;
    //     this.ctx = ctx; //deletar

    //     ctx.drawImage(minotaurImg,
    //         this.minotaurDirection.frames[this.countFrames % this.minotaurDirection.frames.length].x + 8,
    //         this.minotaurDirection.frames[this.countFrames % this.minotaurDirection.frames.length].y + 8,
    //         this.size.x - 16, this.size.y - 16,
    //         this.randomX - worldx, this.randomY - worldy,
    //         this.size.x, this.size.y);

    //     ctx.strokeStyle = 'black';
    //     ctx.lineWidth = 1;
    //     ctx.strokeRect(this.randomX - worldx, this.randomY - worldy, this.size.x, this.size.y);

    //     let now = new Date().getTime();
    //     if (now - this.lastFrameTime > this.frameDuration) {
    //         this.countFrames++;
    //         this.lastFrameTime = now;

    //         this.walkRandom(worldx, worldy, width, height, dpr);
    //     }
    // }

    speed: number = 2;
    move64: number = 0;
    tiles: number = 1 * this.speed;
    cicle: number = 64 / this.speed;
    delayTime: number = 15;
    lastTime: number = 0;
    qtyTilesRandom: number = 0;
    maxTilesRandom: number = this.getRandom(1, 5);
    stopMoviment: boolean = true;
    activeSetLocationMinotaur: boolean = true;
    private walkRandom(world: any, width: number, height: number, dpr: number): void {

        if ((new Date().getTime() - this.lastTime) > this.delayTime) {

            // this.directionRadom = this.directions.up; // se quiser andar random comentar
            if (this.move64 >= this.cicle) {

                this.setLocationMinotaur(this.directionRadom, this.activeSetLocationMinotaur);
                console.log(this.locationMinotaur);
                this.move64 = 0;

                this.qtyTilesRandom++;
                if (this.qtyTilesRandom >= this.maxTilesRandom) {
                    this.stop();
                    this.stopMoviment = false;
                    this.activeSetLocationMinotaur = false;
                    setTimeout(() => {
                        this.stopMoviment = true;
                        this.directionRadom = this.randomDirection(); 
                        // this.directionRadom = this.directions.right; // se quiser andar random comentar
                        this.qtyTilesRandom = 0;
                        this.maxTilesRandom = this.getRandom(1, 5);
                    // }, 100);
                    }, this.getRandom(1000, 3000));
                }
            }

            if (this.stopMoviment) {
                if (!this.collision()) {
                    this.activeSetLocationMinotaur = true;
                    if (this.directionRadom == this.directions.up) {
                        this.randomX += this.getRandom(0, 0);
                        this.randomY -= this.tiles;

                        this.minotaurDirection = this.allMinotaurDirections.up;
                        this.move64++;
                    }
                    else if (this.directionRadom == this.directions.right) {
                        this.randomX += this.tiles;
                        this.randomY += this.getRandom(0, 0);

                        this.minotaurDirection = this.allMinotaurDirections.right;
                        this.move64++;

                    }
                    else if (this.directionRadom == this.directions.left) {
                        this.randomX -= this.tiles;
                        this.randomY += this.getRandom(0, 0);

                        this.minotaurDirection = this.allMinotaurDirections.left;
                        this.move64++;

                    }
                    else if (this.directionRadom == this.directions.down) {
                        this.randomX += this.getRandom(0, 0);
                        this.randomY += this.tiles;

                        this.minotaurDirection = this.allMinotaurDirections.down;
                        this.move64++;
                    }
                } else {
                    this.activeSetLocationMinotaur = false;
                    this.move64 = 65;
                    this.qtyTilesRandom = this.maxTilesRandom;
                }
            }
            this.countRandom++;
            this.lastTime = new Date().getTime();
        }
    }


    private stop() {
        if (this.directionRadom) {
            if (this.directionRadom == this.directions.up) {
                this.minotaurDirection = this.allMinotaurDirections.upStop;
            } else if (this.directionRadom == this.directions.down) {
                this.minotaurDirection = this.allMinotaurDirections.downStop;
            } else if (this.directionRadom == this.directions.left) {
                this.minotaurDirection = this.allMinotaurDirections.leftStop;
            } else if (this.directionRadom == this.directions.right) {
                this.minotaurDirection = this.allMinotaurDirections.rightStop;
            }
        }
    }

    private setLocationMinotaur(direction: string, active: boolean) {
        console.log(direction);
        if (active) {
            if (direction == this.directions.up) this.locationMinotaur.y--;
            else if (direction == this.directions.down) this.locationMinotaur.y++;
            else if (direction == this.directions.right) this.locationMinotaur.x++;
            else if (direction == this.directions.left) this.locationMinotaur.x--;
        }
        this.activeSetLocationMinotaur = true;
    }


    // private walkRandom(worldx: number, worldy: number, width: number, height: number, dpr: number): void {

    //     let rand = this.getRandom(1, 4)
    //     if (this.countRandom > 20 * rand) {

    //         let now = new Date().getTime();
    //         if ((now - this.lastTimeWalkRandom > 2000)) {
    //             this.lastTimeWalkRandom = now;
    //             this.minotaurDirection = this.allMinotaurDirections[this.directionRadom + "Stop"];
    //             this.lastMovimentStop = !this.lastMovimentStop;
    //             this.directionRadom = "";
    //         }

    //         if (this.lastMovimentStop) {
    //             this.directionRadom = this.randomDirection();
    //             this.minotaurDirection = this.allMinotaurDirections[this.directionRadom];
    //             this.countRandom = 0;
    //         }
    //     }

    //     if (!this.followPlayer(worldx, worldy, width, height, dpr)) {
    //         if (this.directionRadom == this.directions.right) {
    //             let x = this.randomX + this.getRandom(0, this.speed);
    //             let y = this.randomY + this.getRandom(0, 0);
    //             if (!this.collision(this.directions.right, this.futurePosition, x, y, width, height, dpr)) {
    //                 this.randomX = x;
    //                 this.randomY = y;
    //                 this.minotaurDirection = this.allMinotaurDirections.right;
    //             } else {
    //                 this.directionRadom = this.randomDirection();
    //             }
    //         }
    //         else if (this.directionRadom == this.directions.left) {
    //             let x = this.randomX + (this.getRandom(0, this.speed) * (-1));
    //             let y = this.randomY + this.getRandom(0, 0);
    //             if (!this.collision(this.directions.left, this.futurePosition, x, y, width, height, dpr)) {
    //                 this.randomX = x;
    //                 this.randomY = y;
    //                 this.minotaurDirection = this.allMinotaurDirections.left;
    //             } else {
    //                 this.directionRadom = this.randomDirection();
    //             }
    //         }
    //         else if (this.directionRadom == this.directions.down) {
    //             let x = this.randomX + this.getRandom(0, 0);
    //             let y = this.randomY + this.getRandom(0, this.speed);
    //             if (!this.collision(this.directions.down, this.futurePosition, x, y, width, height, dpr)) {
    //                 this.randomX = x;
    //                 this.randomY = y;
    //                 this.minotaurDirection = this.allMinotaurDirections.down;
    //             } else {
    //                 this.directionRadom = this.randomDirection();
    //             }

    //         }
    //         else if (this.directionRadom == this.directions.up) {
    //             let x = this.randomX + this.getRandom(0, 0);
    //             let y = this.randomY + (this.getRandom(0, this.speed) * (-1));
    //             if (!this.collision(this.directions.up, this.futurePosition, x, y, width, height, dpr)) {
    //                 this.randomX = x;
    //                 this.randomY = y;
    //                 this.minotaurDirection = this.allMinotaurDirections.up;
    //             }
    //             else {
    //                 this.directionRadom = this.randomDirection();
    //             }
    //         }
    //         this.countRandom++;
    //     }
    // }

    changeDirectionOnCollision: boolean = true;
    directionOnCollision: string = "down";
    // private followPlayer(worldx: number, worldy: number, width: number, height: number, dpr: number): boolean {

    //     let x = this.randomX - worldx;
    //     let y = this.randomY - worldy;
    //     let px = ((width * dpr) / 2);
    //     let py = ((height * dpr) / 2);
    //     let norm = { x: 0, y: 0 };
    //     let halfSize = this.size.x / 2;


    //     //linha ataque
    //     this.ctx.beginPath();
    //     this.ctx.moveTo(px, py);
    //     this.ctx.lineTo(x + halfSize, y + halfSize);
    //     this.ctx.strokeStyle = 'red';
    //     this.ctx.lineWidth = 2;
    //     this.ctx.stroke();

    //     //raio de ataque
    //     this.ctx.beginPath();
    //     this.ctx.arc((x + halfSize), (y + halfSize), this.radius, 0, 2 * Math.PI);
    //     this.ctx.strokeStyle = 'red';
    //     this.ctx.lineWidth = 2;
    //     this.ctx.stroke();

    //     if (x > ((this.size.x * 0.8) * (-1)) && x < width
    //         && y > ((this.size.y * 0.8) * (-1)) && y < height) {

    //         let dx = px - (x + halfSize);
    //         let dy = py - (y + halfSize);
    //         let length = Math.hypot(dx, dy);

    //         if (length < this.radius) {

    //             if (length === 0) {
    //                 norm = { x: 0, y: 0 }
    //             } else {
    //                 norm = { x: (dx / length), y: (dy / length) };
    //             }

    //             // console.log(length);
    //             // console.log(this.followPlayerDirection(x, y, px, py));
    //             let direction = this.followPlayerDirection(x, y, px, py);
    //             if (!this.collision(direction, 20, this.randomX, this.randomY, width, height, dpr)) {
    //                 this.directionOnCollision = direction;
    //                 // if (length > 100) {
    //                 if (direction == this.directions.left || direction == this.directions.right) {
    //                     direction == this.directions.left ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
    //                     this.randomX += (norm.x * this.tiles);
    //                 } else {
    //                     direction == this.directions.up ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
    //                     this.randomY += (norm.y * this.tiles);
    //                 }
    //                 // if (Math.abs(x - px) > Math.abs(y - py)) {
    //                 //     x > px ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
    //                 //     this.randomX += (norm.x * this.speed);
    //                 // } else {
    //                 //     y > py ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
    //                 //     this.randomY += (norm.y * this.speed);
    //                 // }
    //                 this.changeDirectionOnCollision = true;
    //                 // console.log("sem colisao");
    //             } else {

    //                 let t = true;

    //                 // while(t){
    //                 //     if (this.collision(this.directionOnCollision,20, this.randomX, this.randomY, width, height, dpr)) {
    //                 //         this.directionOnCollision = this.otherDirectionHunt(direction);
    //                 //     }else{
    //                 //         t= false;
    //                 //     }
    //                 // }

    //                 if (this.changeDirectionOnCollision) {
    //                     this.directionOnCollision = this.otherDirectionHunt(direction);
    //                     direction = this.directionOnCollision;
    //                     this.changeDirectionOnCollision = false;
    //                 }
    //                 if (this.collision(this.directionOnCollision, 10, this.randomX, this.randomY, width, height, dpr)) {
    //                     this.directionOnCollision = this.otherDirectionHunt(direction);
    //                 }
    //                 direction = this.directionOnCollision;


    //                 // let max = 4;
    //                 // let count = 0;
    //                 // if (this.collision(this.directionOnCollision, 20, this.randomX, this.randomY, width, height, dpr) ) {
    //                 //     this.directionOnCollision = this.otherDirectionHunt(this.directionOnCollision);
    //                 //     direction = this.directionOnCollision;
    //                 //     // count++;
    //                 // }


    //                 if (direction == this.directions.left || direction == this.directions.right) {
    //                     direction == this.directions.left ? norm.x = -1 : norm.x = 1;
    //                     direction == this.directions.left ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
    //                     this.randomX += (norm.x * this.tiles);
    //                 } else {
    //                     direction == this.directions.up ? norm.y = -1 : norm.y = 1;
    //                     direction == this.directions.up ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
    //                     this.randomY += (norm.y * this.tiles);
    //                 }



    //                 // console.log("colisao");
    //                 // if(this.changeDirectionOnCollision){
    //                 //     this.directionOnCollision = this.otherDirectionHunt(direction);
    //                 //     this.changeDirectionOnCollision = false;
    //                 // }
    //                 // direction = this.directionOnCollision;
    //                 // // this.directionRadom = this.otherDirectionHunt(direction);
    //                 // console.log(this.directionRadom);
    //                 // if (direction == this.directions.left || direction == this.directions.right) {
    //                 //     direction == this.directions.left ? norm.x = -1 : norm.x = 1;
    //                 //     direction == this.directions.left ? this.minotaurDirection = this.allMinotaurDirections.left : this.minotaurDirection = this.allMinotaurDirections.right;
    //                 //     this.randomX += (norm.x * this.speed);
    //                 // } else {
    //                 //     direction == this.directions.up ? norm.y = -1 : norm.y = 1;
    //                 //     direction == this.directions.up ? this.minotaurDirection = this.allMinotaurDirections.up : this.minotaurDirection = this.allMinotaurDirections.down;
    //                 //     this.randomY += (norm.y * this.speed);
    //                 // }


    //                 // console.log("");
    //                 // this.directionRadom = this.otherDirection();
    //             }
    //             return true;
    //         }
    //     }
    //     return false;
    // }

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

    private collision() {
        let left = 0, right = 0, up = 0, down = 0;
        if (this.directionRadom == this.directions.left) { left = 1 }
        else if (this.directionRadom == this.directions.right) { right = 1; }
        else if (this.directionRadom == this.directions.up) { up = 1 }
        else if (this.directionRadom == this.directions.down) { down = 1 }

        let mx = this.locationMinotaur.x;
        let my = this.locationMinotaur.y;
        return this.trees.allTrees.some((e) => {
            let maxy = (e.y + e.size.y) - 1;
            let maxx = (e.x + e.size.x) - 1;
            // console.log(e)
            if (this.directionRadom == this.directions.up) {
                if (maxy == (my - 1) && (mx >= e.x && mx <= maxx)) {
                    // console.log(e);
                    return true;
                }
            }
            else if (this.directionRadom == this.directions.down) {
                if (e.y == (my + 1) && (mx >= e.x && mx <= maxx)) {
                    return true;
                }
            }
            else if (this.directionRadom == this.directions.right) {
                if (e.x == (mx + 1) && (my >= e.y && my <= maxy)) {
                    return true;
                }
            }
            else if (this.directionRadom == this.directions.left) {
                if (maxx == (mx - 1) && (my >= e.y && my <= maxy)) {
                    return true;
                }
            }
        });
    }

    // private collision(direction: string, futurePosition: number, x: number, y: number, width: number, height: number, dpr: number): boolean {
    //     let left = 0, right = 0, up = 0, down = 0;
    //     if (direction == this.directions.left) { left = futurePosition; }
    //     if (direction == this.directions.right) { right = futurePosition; }
    //     if (direction == this.directions.up) { up = futurePosition; }
    //     if (direction == this.directions.down) { down = futurePosition; }

    //     let collisionTrees = this.trees.allTrees.some((e) => {

    //         // if ((e.x - worldx) > 0 && (e.x - worldx) < width
    //         //     && (e.y - worldy) > 0 && (e.y - worldy) < height) {

    //         if (((e.x - this.worldX) + e.size.x) > ((x - this.worldX) - left) &&
    //             (e.x - this.worldX) < (((x + this.size.x) - this.worldX) + right) &&
    //             ((e.y - this.worldY) + e.size.y) > ((y - this.worldY) - up) &&
    //             (e.y - this.worldY) < (((y + this.size.y) - this.worldY) + down)) {
    //             return true;
    //         }
    //         // }
    //     });

    //     return collisionTrees;

    //     // //o 32 e metade do player, dps ver ocmo trazer valor
    //     // let colissionPlayer = (
    //     //     ((width * dpr) / 2) - (this.player.size / 2)) < ((x - this.worldX) + this.size) &&
    //     //     (((width * dpr) / 2) + (this.player.size / 2)) > (x - this.worldX) &&
    //     //     (((height * dpr) / 2) - (this.player.size / 2)) < ((y - this.worldY) + this.size) &&
    //     //     (((height * dpr) / 2) + (this.player.size / 2)) > (y - this.worldY);

    //     // return collisionTrees || colissionPlayer;
    // }

    private collisionPlayer(width: number, height: number, x: number, y: number, dpr: number): boolean {
        return (((width * dpr) / 2) - (this.player.size.x / 2)) < ((x - this.worldX) + this.size.x) &&
            (((width * dpr) / 2) + (this.player.size.x / 2)) > (x - this.worldX) &&
            (((height * dpr) / 2) - (this.player.size.x / 2)) < ((y - this.worldY) + this.size.y) &&
            (((height * dpr) / 2) + (this.player.size.x / 2)) > (y - this.worldY);
    }

    private getRandom(min: number, max: number, mult?: number): number {
        let result = Math.floor(Math.random() * max) + min;
        if (mult) result = result * mult;
        return result;
        // return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private randomDirection(): string {
        let direction = this.getRandom(1, 4);
        if (direction == 1) { return this.directions.right }
        else if (direction == 2) { return this.directions.left }
        else if (direction == 3) { return this.directions.down }
        else if (direction == 4) { return this.directions.up }
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