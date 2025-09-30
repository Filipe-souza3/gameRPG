import { EventEmitter } from "./eventEmitter";
import { Player } from "./player";
import { Trees } from "./trees";

export class Minotaur {

    scale: number = 64;
    localImage = "../imgs/minotaur/";
    sizeSprite: number = this.scale;
    size: any = { x: this.scale, y: this.scale };
    locationMinotaur: any = { x: 6, y: 10 };

    radius: number = 36;
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

    //pathfinding
    activePathfinding: boolean = true;

    //class
    trees: Trees = new Trees();
    player: Player = new Player();

    eventEmitter!: EventEmitter;

    constructor() { }


    setEmitter(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
        this.eventEmitter.on("playerMoved", (location: any) => {
            this.player.locationPlayer.x = location.x;
            this.player.locationPlayer.y = location.y;
        });

    }

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

        //raio de ataque
        this.ctx.beginPath();
        this.ctx.arc(((this.randomX - world.x) + 32), ((this.randomY - world.y) + 32), (this.radius * this.scale), 0, 2 * Math.PI);
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        let now = new Date().getTime();
        if (now - this.lastFrameTime > this.frameDuration) {
            this.countFrames++;
            this.lastFrameTime = now;

        }
        this.walkRandom(world, width, height, dpr);
    }


    speed: number = 2;
    move64: number = 0;
    tiles: number = 1 * this.speed;
    cycle: number = 64 / this.speed;
    delayTime: number = 15;
    lastTime: number = 0;
    qtyTilesRandom: number = 0;
    // maxTilesRandom: number = this.getRandom(1, 5);
    maxTilesRandom: number = 0;
    stopMoviment: boolean = true;
    activeSetLocationMinotaur: boolean = true;
    attacking: boolean = false;
    endCicle: boolean = false;
    private walkRandom(world: any, width: number, height: number, dpr: number): void {

        if ((new Date().getTime() - this.lastTime) < this.delayTime) { return; }
        // this.directionRadom = this.directions.up; // se quiser andar random comentar
        // this.directionRadom = this.directions.right; //deletar testes
        if (this.move64 >= this.cycle) {
            // this.directionRadom = this.checkIsOutMap(this.directionRadom);
            console.log("1 CICLO WALK");
            this.move64 = 0;
            this.setLocationMinotaur(this.directionRadom, this.activeSetLocationMinotaur || this.attacking);
            
            if (!this.attacking) {
                this.qtyTilesRandom++;
                this.activeSetLocationMinotaur = false;
                
                if (this.qtyTilesRandom >= this.maxTilesRandom) {
                    this.stop();
                    this.stopMoviment = false;
                    
                    setTimeout(() => {
                        this.stopMoviment = true;
                        this.directionRadom = this.directions.right;
                        this.directionRadom = this.randomDirection();
                        this.qtyTilesRandom = 0;
                        this.maxTilesRandom = this.getRandom(1, 5);
                    }, this.getRandom(500, 1500));
                }
            }
        }

        // if (this.stopMoviment) {
        if (this.move64 == 0) this.attacking = this.attack();
        if (!this.collision() && !this.attacking && this.stopMoviment && this.move64Attack == 0) {

            this.directionRadom = this.checkIsOutMap(this.directionRadom);
            this.activeSetLocationMinotaur = true;
            this.endCicle = true;
            console.log("walk rodando");

            if (this.directionRadom == this.directions.up) {
                this.randomY -= this.tiles;
                this.minotaurDirection = this.allMinotaurDirections.up;
                this.move64++;

            }
            else if (this.directionRadom == this.directions.right) {
                this.randomX += this.tiles;
                this.minotaurDirection = this.allMinotaurDirections.right;
                this.move64++;

            }
            else if (this.directionRadom == this.directions.left) {
                this.randomX -= this.tiles;
                this.minotaurDirection = this.allMinotaurDirections.left;
                this.move64++;

            }
            else if (this.directionRadom == this.directions.down) {
                this.randomY += this.tiles;
                this.minotaurDirection = this.allMinotaurDirections.down;
                this.move64++;
            }

        } else {
            this.activeSetLocationMinotaur = false;
            // if (!this.attacking) this.m;ove64 = 65;
            this.qtyTilesRandom = this.maxTilesRandom;
        }
        // }
        this.countRandom++;
        this.lastTime = new Date().getTime();
        // }
    }

    private checkIsOutMap(direction: string) {
        if (direction == this.directions.left) {
            if (this.locationMinotaur.x == 0) {
                return this.directions.right;
            }
        } else if (direction == this.directions.up) {
            if (this.locationMinotaur.y == 0) {
                return this.directions.down;
            }
        }
        return direction;
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
        if (active) {
            if (direction == this.directions.up) this.locationMinotaur.y--;
            else if (direction == this.directions.down) this.locationMinotaur.y++;
            else if (direction == this.directions.right) this.locationMinotaur.x++;
            else if (direction == this.directions.left) this.locationMinotaur.x--;
        }
        console.log(this.locationMinotaur);
        console.log(this.player.locationPlayer);
        console.log("-------------------------");
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


    //nao deletar followPlayer

    // changeDirectionOnCollision: boolean = true;
    // directionOnCollision: string = "down";
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

    move64Attack: number = 0;
    // oneCycle: boolean = false;
    dx: number = 0;
    dy: number = 0;
    pathAttack: any;

    coordOld: any;
    coord: any;
    endOld: any;
    //depois excluir os paramtros pois vai egar a localizaçao od player pelo listeners
    private attack(world?: any, width?: number, height?: number, dpr?: number) {
        if (this.player.locationPlayer.x == 0 || this.locationMinotaur.x == 0 || this.player.locationPlayer.y == 0 || this.locationMinotaur.y == 0) {
            this.coordOld = undefined;
            return false;
        }


        let dx = Math.abs(this.player.locationPlayer.x - this.locationMinotaur.x);
        let dy = Math.abs(this.player.locationPlayer.y - this.locationMinotaur.y);

        let length = Math.hypot(dx, dy);
        // console.log(`dx ${dx}, dy ${dy}, length ${length}`);

        // if (length < this.radius || this.oneCycle) {
        // if (length > this.radius && !this.oneCycle) { this.activePathfinding = true; console.log("return"); return false; }
        if (length > this.radius && this.move64Attack == 0) { this.coordOld = undefined; this.activePathfinding = true; console.log("return"); return false; }


        // if (this.activePathfinding) {
        //     this.pathAttack = this.pathFinding();
        //     this.activePathfinding = false;
        // }


        if (this.move64Attack == 0) {

            if ((!this.endOld || this.endOld.x != this.player.locationPlayer.x || this.endOld.y != this.player.locationPlayer.y) || 
                (Math.abs(this.player.locationPlayer.x - this.locationMinotaur.x) > 1 || Math.abs(this.player.locationPlayer.y - this.locationMinotaur.y) > 1 )) {
            // if (!this.endOld ) {
                let clonePlayer = structuredClone(this.player.locationPlayer);
                this.pathAttack = [];
                this.pathAttack = this.pathFinding({ x: clonePlayer.x, y: clonePlayer.y });
                this.endOld = clonePlayer;
            }

            if (this.pathAttack && this.pathAttack.length > 0) {
                this.coord = this.pathAttack.shift();
            }

            this.dx = this.locationMinotaur.x - this.player.locationPlayer.x;
            this.dy = this.locationMinotaur.y - this.player.locationPlayer.y;
            // console.log(this.directionRadom);
            this.directionRadom = this.checkIsOutMap(this.directionRadom);
            // console.log(this.directionRadom);
        }

        if (this.move64Attack >= this.cycle) {
            // this.coord = this.pathAttack.shift();
            console.log("1 CICLO ATTACK");
            this.coordOld = this.coord;
            this.coord = []; //testeando
            this.move64Attack = 0;
            // this.oneC;ycle = false;
            this.dx = 0;
            this.dy = 0;
            this.setLocationMinotaur(this.directionRadom, true);
        }

        if (!this.coordOld) { this.coordOld = structuredClone(this.locationMinotaur); }
        if (!this.coord && this.coord.length <= 0) {this.coordOld = undefined; return false; }
        if(this.move64 > 0){this.coordOld = undefined; return false;}


        // let direction;
        if (this.coord.x > this.coordOld.x) {
            // direction = this.directions.right;
            this.move64Attack++;
            this.directionRadom = this.directions.right;
            this.minotaurDirection = this.allMinotaurDirections.right;
            this.randomX += this.tiles;
            // this.oneCycle = true;
        }
        else if (this.coord.x < this.coordOld.x) {
            // direction = this.directions.left;
            this.move64Attack++;
            this.directionRadom = this.directions.left;
            this.minotaurDirection = this.allMinotaurDirections.left;
            this.randomX -= this.tiles;
            // this.oneCycle = true;
        }
        else if (this.coord.y > this.coordOld.y) {
            // direction = this.directions.down;
            this.move64Attack++;
            this.directionRadom = this.directions.down;
            this.minotaurDirection = this.allMinotaurDirections.down;
            this.randomY += this.tiles;
            // this.oneCycle = true;
        }
        else if (this.coord.y < this.coordOld.y) {
            // direction = this.directions.up;
            this.move64Attack++;
            this.directionRadom = this.directions.up;
            this.minotaurDirection = this.allMinotaurDirections.up;
            this.randomY -= this.tiles;
            // this.oneCycle = true;
        }

        return true;

    }




    // pararwhile: boolean = false; // depois deletar somente teste
    realCost:number = 0;
    private pathFinding(endTile: any) {
        // if (direction == this.directions.left) {


        // let neighborsLeftRight = [{ x: 0, y: -1 }, { x: 0, y: 1 }];
        // let neighborsUpDown = [{ x: -1, y: 0 }, { x: 1, y: 0 }];

        // let path = [];
        console.log(endTile);
        let visited: node[] = [];
        let start = { x: this.locationMinotaur.x, y: this.locationMinotaur.y };
        let tile = { x: this.locationMinotaur.x, y: this.locationMinotaur.y };
        let end = endTile;
        // let end = { x: this.player.locationPlayer.x, y: this.player.locationPlayer.y }
        // let finish = true;

        let dxx = this.player.locationPlayer.x - this.locationMinotaur.x;
        let dyy = this.player.locationPlayer.y - this.locationMinotaur.y;
        let length = Math.hypot(dxx, dyy);


        // if (length < this.radius && this.pararwhile == false) {
        // this.pararwhile = true;

        let allDirections = [{ x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 }];
        let openList: node[] = [];
        let tempNodes = [];

        let cost = start.x + start.y;
        let heur = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
        let som = cost + heur;

        let node: node = {
            position: { x: start.x, y: start.y },
            cost: cost,
            heur: heur,
            som: som,
            prev: undefined
        };


        openList.push(node);
        visited.push(node);
        tempNodes.push(node);

        let finded = false;
        let count = 0;
        while (count < 500) {
            count++;
            // while (!finded) {

            let bestSom: node | undefined, bestHeur: node | undefined;
            if (tempNodes.length > 0 || openList.length > 0) {
                openList.sort((cur: any, prev: any) => cur.som - prev.som);
                let bestSom = openList.shift();
                // let bestSom = tempNodes.reduce((cur: any, prev: any) => { return cur.som < prev.som ? cur : prev });
                let bestHeur = tempNodes.find((e: any) => { return (bestSom!.som == e.som) && (bestSom!.heur > e.heur) });

                // let bestNode = bestHeur || bestSom!;
                let bestNode = bestSom!;

                tempNodes = [];
                // let allTempNodes = [];
                let i = 0;
                while (i <= (allDirections.length - 1)) {
                    this.realCost++;
                    let x = bestNode.position.x;
                    let y = bestNode.position.y;

                    x += allDirections[i].x;
                    y += allDirections[i].y;

                    // cost = x + y;
                    cost = this.realCost;
                    heur = Math.abs(x - end.x) + Math.abs(y - end.y);
                    som = cost + heur;

                    const newNode: node = {
                        position: { x: x, y: y },
                        cost: cost,
                        heur: heur,
                        som: som,
                        prev: bestNode
                    }

                    if (
                        !this.collisionAttack(x, y) &&
                        // !openList.some((e: any) => e.position.x == x && e.position.y == y) && 
                        !visited.some((e: any) => e.position.x == x && e.position.y == y) &&
                        x > 0 && y > 0) {

                        // cost = x + y;
                        // heur = Math.abs(x - end.x) + Math.abs(y - end.x);
                        // som = cost + heur;

                        // const newNode: node = {
                        //     position: { x: x, y: y },
                        //     cost: cost,
                        //     heur: heur,
                        //     som: som,
                        //     prev: bestNode
                        // }

                        openList.push(newNode);
                        tempNodes.push(newNode);
                        if (x == end.x && y == end.y) {
                            count = 550;
                            // finded = true;

                            this.realCost = 0;
                            i = 50;
                        }
                    }
                    // allTempNodes.push(newNode);
                    // if(i == 3 && tempNodes.length == 0){  }
                    visited.push(newNode);
                    i++;
                }
            }
        };

        let last = openList[(openList.length - 1)];
        let path = [];
        path.push(last.position);
        let finish = false;
        while (!finish) {
            if (last.prev) {
                path.push(last.prev.position);
                last = last.prev;
            } else {
                finish = true;
            }
        }

        console.log(openList);
        console.log(path);
        path.reverse();
        path.shift();
        path.pop(); //depois descomentar
        return path
    }


    private collisionAttack(mx: number, my: number) {

        return this.trees.allTrees.some((e) => {
            let maxy = (e.y + e.size.y) - 1;
            let maxx = (e.x + e.size.x) - 1;
            // if (this.directionRadom == this.directions.up) {
            if (maxy == my && (mx >= e.x && mx <= maxx)) {
                return true;
            }
            // }
            // else if (this.directionRadom == this.directions.down) {
            if (e.y == my && (mx >= e.x && mx <= maxx)) {
                return true;
            }
            // }
            // else if (this.directionRadom == this.directions.right) {
            if (e.x == mx && (my >= e.y && my <= maxy)) {
                return true;
            }
            // }
            // else if (this.directionRadom == this.directions.left) {
            if (maxx == mx && (my >= e.y && my <= maxy)) {
                return true;
            }
            // }
        });
    }

    private collision() {

        let mx = this.locationMinotaur.x;
        let my = this.locationMinotaur.y;
        return this.trees.allTrees.some((e) => {
            let maxy = (e.y + e.size.y) - 1;
            let maxx = (e.x + e.size.x) - 1;
            if (this.directionRadom == this.directions.up) {
                if (maxy == (my - 1) && (mx >= e.x && mx <= maxx)) {
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




}

interface node {
    position: any,
    cost: number,
    heur: number,
    som: number,
    prev?: node
}