import { EventEmitter } from "./eventEmitter";
import { Player } from "./player";
import { Trees } from "./trees";

export class Minotaur {

    scale: number = 64;
    localImage = "../imgs/minotaur/";
    sizeSprite: number = this.scale;
    size: any = { x: this.scale, y: this.scale };
    locationMinotaur: any = { x: 1, y: 5 };

    radius: number = 6;
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
    directionRadom: string = this.randomDirection();
    // directionRadom: string = this.directions.left;

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
        this.eventEmitter.on("playerStatus", (status:any)=>{
            if(status){
                this.player.setName(status.name, false);
            }
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

        console.log(this.directionRadom);
        if ((new Date().getTime() - this.lastTime) < this.delayTime) { return; }
        // this.directionRadom = this.directions.up; // se quiser andar random comentar
        if (this.move64 >= this.cycle) {
            console.log(this.directionRadom);
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
                        this.directionRadom = this.randomDirection();
                        this.qtyTilesRandom = 0;
                        this.maxTilesRandom = this.getRandom(1, 5);
                    }, this.getRandom(500, 1500));
                }
            }
        }


        if (this.move64 == 0) this.attacking = this.attack();
        let collision = !this.collision();
        // if (!this.collision() && !this.attacking && this.stopMoviment && this.move64Attack == 0) {
        if (collision && !this.attacking && this.stopMoviment && this.move64Attack == 0) {

            this.directionRadom = this.checkIsOutMap(this.directionRadom);
            this.activeSetLocationMinotaur = true;
            this.endCicle = true;

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
            // if(this.move64Attack ==0 && !this.attacking){this.directionRadom = this.randomDirection();;}
            if(!collision){this.directionRadom = this.randomDirection();;}
            // if(this.move64Attack > 0){this.move64 = this.move64Attack;}
            this.qtyTilesRandom = this.maxTilesRandom;
        }

        this.countRandom++;
        this.lastTime = new Date().getTime();

    }

    private checkIsOutMap(direction: string) {
        if (direction == this.directions.left) {
            if (this.locationMinotaur.x == 0) {
                return this.directions.right;
                // this.move64  = 0;
            }
        } else if (direction == this.directions.up) {
            if (this.locationMinotaur.y == 0) {
                return this.directions.down;
                // this.move64  = 0;
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


    move64Attack: number = 0;
    dx: number = 0;
    dy: number = 0;
    pathAttack: any;
    coordOld: any;
    coord: any;
    endOld: any;
    //depois excluir os paramtros pois vai egar a localizaçao od player pelo listeners
    private attack(world?: any, width?: number, height?: number, dpr?: number) {
        if(!this.player.getName()){
            return false;
        }
        if (this.player.locationPlayer.y <= 0 || this.player.locationPlayer.x <= 0) {
            if(this.move64Attack >= this.cycle){
                this.coordOld = undefined;
                return false;
            }
        }
        // if (this.player.locationPlayer.x == 0 || this.locationMinotaur.x == 0 || this.player.locationPlayer.y <= 0 || this.locationMinotaur.y <= 0) {
        //     this.coordOld = undefined;
        //     return false;
        // }

        let dx = Math.abs(this.player.locationPlayer.x - this.locationMinotaur.x);
        let dy = Math.abs(this.player.locationPlayer.y - this.locationMinotaur.y);
        let length = Math.hypot(dx, dy);

        if (length > this.radius && this.move64Attack == 0) {
            this.coordOld = undefined;
            this.activePathfinding = true;
            return false;
        }

        if (this.move64Attack == 0) {

            if ((!this.endOld || this.endOld.x != this.player.locationPlayer.x || this.endOld.y != this.player.locationPlayer.y) ||
                (Math.abs(this.player.locationPlayer.x - this.locationMinotaur.x) > 1 || Math.abs(this.player.locationPlayer.y - this.locationMinotaur.y) > 1)) {

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
            this.directionRadom = this.checkIsOutMap(this.directionRadom);
        }

        if (this.move64Attack >= this.cycle) {

            this.coordOld = this.coord;
            this.coord = [];
            this.move64Attack = 0;

            this.dx = 0;
            this.dy = 0;
            this.setLocationMinotaur(this.directionRadom, true);
        }

        if (!this.coordOld) { this.coordOld = structuredClone(this.locationMinotaur); }
        if (!this.coord && this.coord.length <= 0) { this.coordOld = undefined; return false; }
        if (this.move64 > 0) { this.coordOld = undefined; return false; }


        if (this.coord.x > this.coordOld.x) {
            this.move64Attack++;
            this.directionRadom = this.directions.right;
            this.minotaurDirection = this.allMinotaurDirections.right;
            this.randomX += this.tiles;
        }
        else if (this.coord.x < this.coordOld.x) {
            this.move64Attack++;
            this.directionRadom = this.directions.left;
            this.minotaurDirection = this.allMinotaurDirections.left;
            this.randomX -= this.tiles;
        }
        else if (this.coord.y > this.coordOld.y) {
            this.move64Attack++;
            this.directionRadom = this.directions.down;
            this.minotaurDirection = this.allMinotaurDirections.down;
            this.randomY += this.tiles;
        }
        else if (this.coord.y < this.coordOld.y) {
            this.move64Attack++;
            this.directionRadom = this.directions.up;
            this.minotaurDirection = this.allMinotaurDirections.up;
            this.randomY -= this.tiles;
        }

        return true;

    }


    realCost: number = 0;
    private pathFinding(endTile: any) {

        let visited: node[] = [];
        let start = { x: this.locationMinotaur.x, y: this.locationMinotaur.y };
        let end = endTile;


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

        // let finded = false;
        let count = 0;
        while (count < 500) {
            count++;


            // let bestSom: node | undefined, bestHeur: node | undefined;
            if (tempNodes.length > 0 || openList.length > 0) {
                openList.sort((cur: any, prev: any) => cur.som - prev.som);
                let bestSom = openList.shift();
                let bestHeur = tempNodes.find((e: any) => { return (bestSom!.som == e.som) && (bestSom!.heur > e.heur) });

                // let bestNode = bestHeur || bestSom!;
                let bestNode = bestSom!;

                tempNodes = [];
                let i = 0;
                while (i <= (allDirections.length - 1)) {
                    this.realCost++;
                    let x = bestNode.position.x;
                    let y = bestNode.position.y;

                    x += allDirections[i].x;
                    y += allDirections[i].y;

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
                        !visited.some((e: any) => e.position.x == x && e.position.y == y) &&
                        x > 0 && y > 0) {

                        openList.push(newNode);
                        tempNodes.push(newNode);
                        if (x == end.x && y == end.y) {

                            count = 550;
                            this.realCost = 0;
                            i = 50;
                        }
                    }
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

        path.reverse();
        path.shift();
        path.pop();
        return path;
    }


    private collisionAttack(mx: number, my: number) {

        return this.trees.allTrees.some((e) => {
            let maxy = (e.y + e.size.y) - 1;
            let maxx = (e.x + e.size.x) - 1;

            if (maxy == my && (mx >= e.x && mx <= maxx)) {
                return true;
            }
            else if (e.y == my && (mx >= e.x && mx <= maxx)) {
                return true;
            }
            else if (e.x == mx && (my >= e.y && my <= maxy)) {
                return true;
            }
            else if (maxx == mx && (my >= e.y && my <= maxy)) {
                return true;
            }

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