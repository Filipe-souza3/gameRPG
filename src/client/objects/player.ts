import { EventEmitter } from "./eventEmitter";
import { Trees } from "./trees";


export class Player {

    scale: number = 64;
    private id?: number;
    localImage: string = "../imgs/citizen/";
    size: any = { x: this.scale, y: this.scale };
    locationPlayer: any = { x: 9, y: 10 };
    speed: number = 4;
    tiles: number = 1 * this.speed;
    cycle: number = 64 / this.speed;
    marginCollision: number = 0;
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

    //fazer o player andar os 64px por ciclo
    move64: number = 0;
    key: any = null;

    //keys
    keys: any = {};
    pressedLastKey: string = "";
    delayKeyPress: number = 15;
    lastKeyPress: number = 0;
    arrowKeys: any = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    }
    activeSetLocationPlayer: boolean = true;

    //class
    trees: Trees = new Trees();

    eventEmitter!: EventEmitter;

    constructor() { }

    setEmitter(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }


    drawPlayer(ctx: CanvasRenderingContext2D, img: HTMLImageElement, width: number, height: number, dpr: number) {
        let playerImg = img;
        playerImg.src = this.direction.img;

        let x = Math.trunc(width / this.scale) - 1;
        x = x / 2;
        x = x * this.scale;
        let y = Math.trunc(height / this.scale) - 1;
        y = y / 2;
        y = y * this.scale;

        // let px = 1 * this.scale;
        // let py = 3 * this.scale;

        ctx.drawImage(playerImg,
            this.direction.frames[this.countFrames % this.direction.frames.length].x,
            this.direction.frames[this.countFrames % this.direction.frames.length].y,
            64, 64,
            x, y,
            // ((width * dpr) / 2) - (this.size.x / 2), ((height * dpr) / 2) - (this.size.y / 2),
            this.size.x, this.size.y);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.size.x, this.size.y);
        // ctx.strokeRect(((width * dpr) / 2) - (this.size.x / 2), ((height * dpr) / 2) - (this.size.y / 2), this.size.x, this.size.y);

        if (this.countFrames >= 8) { this.countFrames = 0 }

        if (new Date().getTime() - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = new Date().getTime();
        }

    }


    move(keys: any, world: any, width: number, height: number, dpr: number, minotaurx: number, minotaury: number, minotaurSize: number) {

        if (this.key === null && Object.keys(keys).length > 0 && Object.values(keys).filter(Boolean).length === 1) { this.key = structuredClone(keys); }
        if ((new Date().getTime() - this.lastKeyPress) > this.delayKeyPress) {

            if (this.move64 >= this.cycle) {
                // console.log(keys); console.log(this.key);
                this.setLocationPlayer(this.key, this.activeSetLocationPlayer); this.key = null; this.move64 = 0; this.stop();
            }
            if (Object.keys(keys).length > 0) {

                if (this.key && this.key[this.arrowKeys.up]) {

                    let check = true;
                    if (this.move64 == 0) {
                        if (this.collision(this.arrowKeys.up)) {
                            check = false;
                            this.move64 = 64;
                            this.activeSetLocationPlayer = false;
                        }
                    }
                    if (check) {
                        this.direction = this.directions.up;
                        world.y -= this.tiles;
                        this.pressedLastKey = this.arrowKeys.up;
                        this.move64++;
                    }
                }
                else if (this.key && this.key[this.arrowKeys.left]) {
                    // else if (keys[this.arrowKeys.left] && !(this.collision(this.arrowKeys.left, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize))) {
                    let check = true;
                    if (this.move64 == 0) {
                        if (this.collision(this.arrowKeys.left)) {
                            check = false;
                            this.move64 = 64;
                            this.activeSetLocationPlayer = false;
                        }
                    }
                    if (check) {
                        this.direction = this.directions.left;
                        world.x -= this.tiles;
                        this.pressedLastKey = this.arrowKeys.left;
                        this.move64++;

                    }
                }
                else if (this.key && this.key[this.arrowKeys.down]) {
                    // else if (keys[this.arrowKeys.down] && !this.collision(this.arrowKeys.down, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize)) {
                    let check = true;
                    if (this.move64 == 0) {
                        if (this.collision(this.arrowKeys.down)) {
                            check = false;
                            this.move64 = 64;
                            this.activeSetLocationPlayer = false;
                        }
                    }
                    if (check) {
                        this.direction = this.directions.down;
                        world.y += this.tiles;
                        this.pressedLastKey = this.arrowKeys.down;
                        this.move64++;
                    }
                }
                else if (this.key && this.key[this.arrowKeys.right]) {
                    // else if (keys[this.arrowKeys.right] && !this.collision(this.arrowKeys.right, this.marginCollision, world.x, world.y, width, height, dpr, minotaurx, minotaury, minotaurSize)) {
                    let check = true;
                    if (this.move64 == 0) {
                        if (this.collision(this.arrowKeys.right)) {
                            check = false;
                            this.move64 = 64;
                            this.activeSetLocationPlayer = false;
                        }
                    }
                    if (check) {
                        this.direction = this.directions.right;
                        world.x += this.tiles;
                        this.pressedLastKey = this.arrowKeys.right;
                        this.move64++;

                    }
                }
            }
            this.lastKeyPress = new Date().getTime();
        }
    }

    // collision1(key: string, futurePosition: number, worldx: number, worldy: number, width: number, height: number, dpr: number, minotaurx: number, minotaury: number, minotaurSize: number) {
    //     let left = 0, right = 0, up = 0, down = 0;
    //     if (key == this.arrowKeys.left) { left = futurePosition }
    //     if (key == this.arrowKeys.right) { right = futurePosition; }
    //     if (key == this.arrowKeys.up) { up = futurePosition; }
    //     if (key == this.arrowKeys.down) { down = futurePosition; }
    //     let halfPlayer = this.size.x / 2;

    //     let collisionTrees = this.trees.allTrees.some((e) => {

    //         if ((e.x - worldx) > 0 && (e.x - worldx) < width
    //             && (e.y - worldy) > 0 && (e.y - worldy) < height) {

    //             if (((e.x - worldx) + e.size.x + halfPlayer) >= (((width) / 2)) - left
    //                 && (e.x - worldx) <= ((((width) / 2)) + halfPlayer + right)
    //                 && ((e.y - worldy) + e.size.y + halfPlayer) >= ((height) / 2) - up
    //                 && (e.y - worldy) <= (((height) / 2) + halfPlayer + down)) {
    //                 // if (((e.x - worldx) + e.size.x + halfPlayer) >= ((width * dpr) / 2) - left
    //                 //     && (e.x - worldx) <= (((width * dpr) / 2) + halfPlayer + right)
    //                 //     && ((e.y - worldy) + e.size.y + halfPlayer) >= ((height * dpr) / 2) - up
    //                 //     && (e.y - worldy) <= (((height * dpr) / 2) + halfPlayer + down)) {

    //                 return true;
    //             }
    //         }
    //     });

    //     let colisionMinotaur =
    //         (((width * dpr) / 2) - halfPlayer) - left < ((minotaurx - worldx) + minotaurSize) &&
    //         (((width * dpr) / 2) + halfPlayer) + right > (minotaurx - worldx) &&
    //         (((height * dpr) / 2) - halfPlayer) + down < ((minotaury - worldy) + minotaurSize) &&
    //         (((height * dpr) / 2) + halfPlayer) - up > (minotaury - worldy);

    //     return collisionTrees || colisionMinotaur;
    // }


    collision(key: string) {

        let left = 0, right = 0, up = 0, down = 0;
        if (key == this.arrowKeys.left) { left = 1 }
        else if (key == this.arrowKeys.right) { right = 1; }
        else if (key == this.arrowKeys.up) { up = 1 }
        else if (key == this.arrowKeys.down) { down = 1 }

        let px = this.locationPlayer.x;
        let py = this.locationPlayer.y;
        return this.trees.allTrees.some((e) => {
            let maxy = (e.y + e.size.y) - 1;
            let maxx = (e.x + e.size.x) - 1;

            if (key == this.arrowKeys.up) {
                if (maxy == (py - 1) && (px >= e.x && px <= maxx)) {
                    return true;
                }
            }
            else if (key == this.arrowKeys.down) {
                if (e.y == (py + 1) && (px >= e.x && px <= maxx)) {
                    return true;
                }
            }
            else if (key == this.arrowKeys.right) {
                if (e.x == (px + 1) && (py >= e.y && py <= maxy)) {
                    return true;
                }
            }
            else if (key == this.arrowKeys.left) {
                if (maxx == (px - 1) && (py >= e.y && py <= maxy)) {
                    return true;
                }
            }
        });
    }

    stop() {
        if (this.key === null) {
            if (this.pressedLastKey == this.arrowKeys.up) {
                this.direction = this.directions.upStop;
            } else if (this.pressedLastKey == this.arrowKeys.down) {
                this.direction = this.directions.downStop;
            } else if (this.pressedLastKey == this.arrowKeys.left) {
                this.direction = this.directions.leftStop;
            } else if (this.pressedLastKey == this.arrowKeys.right) {
                this.direction = this.directions.rightStop;
            }
        }
    }

    setLocationPlayer(key: string, active: boolean) {
        // console.log(key);
        if (active) {
            if (key[this.arrowKeys.up]) this.locationPlayer.y--;
            else if (key[this.arrowKeys.down]) this.locationPlayer.y++;
            else if (key[this.arrowKeys.right]) this.locationPlayer.x++;
            else if (key[this.arrowKeys.left]) this.locationPlayer.x--;
        }
        this.eventEmitter.emit("playerMoved", { x: this.locationPlayer.x, y: this.locationPlayer.y });
        console.log(this.locationPlayer);
        this.activeSetLocationPlayer = true;
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