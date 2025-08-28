// import { server } from "../server/server";
import { io } from 'socket.io-client';
import { trees } from './objects/trees';
// import { magicFieldBlue, frameFieldBlue } from './objects/others';
import { timeLog } from 'console';
import { Others } from './objects/others';
import { Minotaur } from './objects/minotaur';
/*
ver sobre chunks
carregar objs conforme aparece na camera
colisoes com ambinte
minimapa, mundo mo limite

*/


export class index {

    socket = io("http://localhost:3000");

    //classes
    magicFieldBlue: Others = new Others();
    minotaur: Minotaur = new Minotaur();

    //player
    name?: string;
    id?: string;

    //area
    dpr: number = window.devicePixelRatio || 1; //valor repsentante do pixel real
    steps: number = 0.5; //velocidade
    marginCollision: number = 5;
    canvasArea: HTMLCanvasElement = document.getElementById("area") as HTMLCanvasElement;
    canvasObjects: HTMLCanvasElement = document.getElementById("objects") as HTMLCanvasElement;
    ctxArea?: CanvasRenderingContext2D;
    ctx?: CanvasRenderingContext2D;
    width: number = 0;
    height: number = 0;
    worldx: number = 0;
    worldy: number = 0;
    keys: any = {};
    keyCollision?: string;


    globalFrames: any = {
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
    playerDirection: any = null;
    myPlayer: any = {
        size: 64,
        direction: {
            up: { img: "./imgs/citizen/CitizenMaleMoveUp.png", frames: this.globalFrames.move },
            down: { img: "./imgs/citizen/CitizenMaleMoveDown.png", frames: this.globalFrames.move },
            left: { img: "./imgs/citizen/CitizenMaleMoveLeft.png", frames: this.globalFrames.move },
            right: { img: "./imgs/citizen/CitizenMaleMoveRight.png", frames: this.globalFrames.move },
            upStop: { img: './imgs/citizen/CitizenMaleUp.png', frames: this.globalFrames.stop },
            downStop: { img: './imgs/citizen/CitizenMaleDown.png', frames: this.globalFrames.stop },
            leftStop: { img: './imgs/citizen/CitizenMaleLeft.png', frames: this.globalFrames.stop },
            rightStop: { img: './imgs/citizen/CitizenMaleRight.png', frames: this.globalFrames.stop },
        },
    }
    framePlayer: number = 0;
    lastFrameTime: number = 0;
    frameDuration: number = 100;


    //groud
    ground: any = { x: 0, y: 0, sizex: 0, sizey: 0, img: "grass.jpg" };
    groundx: number = 0;
    groundy: number = 0;
    objects: any[] = [
        { x: 100, y: 300, size: 130, color: "orange", img: "tree.webp" },
        { x: 300, y: -200, size: 80, color: "gray", img: "tree3.png" },
        { x: 20, y: 10, size: 40, color: "green", img: "tree4.png" },
        { x: -150, y: 50, size: 55, color: "blue", img: "tree2.png" },
        { x: -200, y: -150, size: 100, color: "black", img: "tree1.png" },
    ];

    //keys
    pressedLastKey: string = "";
    delayKeyPress: number = 10;
    lastKeyPress: number = 0;
    arrowKeys: any = {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight"
    }

    //images
    playerGif = new Image();
    minotaurImage = new Image();




    constructor() {
        this.instanceObejcts();
        this.addlisteners();
        this.createCanvas();
        this.resizeCanvas();
        this.initSocket();
        this.gameLoop();
        this.createImages();
        // this.playerGif.src = this.myPlayer.direction.downStop.img;
    }

    instanceObejcts() {
        // this.magicFieldBlue = new Others();
    }

    createImages() {
        this.playerDirection = this.myPlayer.direction.downStop;
        this.playerGif.src = this.playerDirection.img;


    }


    createCanvas() {
        // let canvas = document.getElementById("area") as HTMLCanvasElement;
        // this.ctx = canvas.getContext("2d") || undefined;

        this.ctx = this.canvasObjects.getContext("2d") || undefined;
        this.ctxArea = this.canvasArea.getContext("2d") || undefined;
        // this.ctxObjects!.fillStyle = "green";

    }

    resizeCanvas() {
        let allCanvas = document.getElementById("all-canvas") as HTMLDivElement;
        //area
        // this.width = this.canvasObjects.clientWidth;
        // this.height = this.canvasObjects.clientHeight;
        // this.canvasObjects.width = this.width * this.dpr;
        // this.canvasObjects.height = this.height * this.dpr;
        // this.canvasObjects.style.width = this.width + "px";
        // // this.canvasObjects.style.height = this.height + "px";
        // this.canvasObjects.style.height = "900px";

        //objects
        this.width = allCanvas.clientWidth;
        this.height = allCanvas.clientHeight;
        // this.width = this.canvasObjects.clientWidth;
        // this.height = this.canvasObjects.clientHeight;
        this.canvasObjects.width = this.width * this.dpr;
        this.canvasObjects.height = this.height * this.dpr;
        this.canvasObjects.style.width = this.width + "px";
        // this.canvasObjects.style.height = this.height + "px";
        this.canvasObjects.style.height = "900px";

        this.ground.sizex = this.width;
        this.ground.sizey = this.height;

        //para fazer o chao carregar ao andar
        this.groundx = this.ground.x;
        this.groundy = this.ground.y;
    }


    drawObjects() {

        this.ctx?.clearRect(0, 0, this.width, this.height);

        this.drawGround();
        this.minotaur.drawMinotaur(this.ctx!, this.worldx, this.worldy, this.minotaurImage, this.width, this.height, this.dpr);

        if (this.name) {
            this.createPlayer();
            if (this.magicFieldBlue.countShow < this.magicFieldBlue.frameDuration) {
                this.drawMagicFieldBlue();
                this.magicFieldBlue.countShow++;
            }
        }
        trees.forEach((obj) => {

            if ((obj.x - this.worldx) > ((obj.size * 0.8) * (-1)) && (obj.x - this.worldx) < this.width
                && (obj.y - this.worldy) > ((obj.size * 0.8) * (-1)) && (obj.y - this.worldy) < this.height) {


                let screenX = obj.x - this.worldx;
                let screenY = obj.y - this.worldy;

                this.drawTrees(obj, screenX, screenY);

                // }
                // this.ctx!.fillStyle = obj.color;
                // this.ctx!.fillRect(screenX, screenY, obj.size, obj.size);
            }
        });


    }

    drawTrees(tree: any, screenX: number, screenY: number) {
        let trees = new Image();
        trees.src = './imgs/' + tree.img;
        this.ctx!.drawImage(trees, screenX, screenY, tree.size, tree.size);


        this.ctx!.strokeStyle = 'black';
        this.ctx!.lineWidth = 1;
        this.ctx!.strokeRect(screenX, screenY, tree.size, tree.size);
    }

    drawMagicFieldBlue() {
        let x = (this.width * this.dpr / 2);
        let y = (this.height * this.dpr / 2);
        // let x = (this.width / 2) - (magicFieldBlue.size / 2);
        // let y = (this.height / 2) - (magicFieldBlue.size / 2);
       
        let fieldImg = new Image();
        fieldImg.src = this.magicFieldBlue.img;
        this.ctx!.drawImage(fieldImg,
            this.magicFieldBlue.frames[this.magicFieldBlue.countFrames % this.magicFieldBlue.frames.length].x,
            this.magicFieldBlue.frames[this.magicFieldBlue.countFrames % this.magicFieldBlue.frames.length].y,
            this.magicFieldBlue.size, this.magicFieldBlue.size,
            ((this.width * this.dpr) / 2) - (this.myPlayer.size / 2), ((this.height * this.dpr) / 2) - (this.myPlayer.size / 2),
            this.magicFieldBlue.size*2, this.magicFieldBlue.size*2);

        // this.ctx!.strokeStyle = 'black';
        // this.ctx!.lineWidth = 1;
        // this.ctx!.strokeRect(x - this.worldx, y - this.worldy,  sizeImage,  sizeImage);

        if (this.magicFieldBlue.countFrames >= this.magicFieldBlue.maxFrames) { this.magicFieldBlue.countFrames = 0; }

        if (new Date().getTime() - this.magicFieldBlue.lastFrameTime > this.magicFieldBlue.frameDuration) {
            this.magicFieldBlue.countFrames++;
            this.magicFieldBlue.lastFrameTime = new Date().getTime();
        }
    }



    drawGround() {
        let ground = new Image();
        ground.src = './imgs/' + this.ground.img;

        let moveX = Math.floor((this.groundx - this.width) - this.worldx);
        let moveY = Math.floor((this.groundy - this.height) - this.worldy);
        let moveXX = Math.floor((this.groundx + this.width) - this.worldx);
        let moveYY = Math.floor((this.groundy + this.height) - this.worldy);
        let y = Math.floor(this.groundy - this.worldy);
        let x = Math.floor(this.groundx - this.worldx);

        //center
        this.ctx!.drawImage(ground, x, y, this.width + 8, this.height + 8);
        //left
        this.ctx!.drawImage(ground, moveX, y, this.width, this.height);
        //right
        this.ctx!.drawImage(ground, moveXX, y, this.width, this.height);
        //up
        this.ctx!.drawImage(ground, x, moveY, this.width, this.height);
        //down
        this.ctx!.drawImage(ground, x, moveYY, this.width, this.height);
        //top left
        this.ctx!.drawImage(ground, moveX, moveY, this.width, this.height);

        this.ctx!.lineWidth = 0;

        if (this.groundx > (this.worldx)) {
            this.groundx = this.groundx - this.width;
        }
        if (this.groundx < (this.worldx)) {
            this.groundx = this.groundx + this.width;
        }
        if (this.groundy > (this.worldy)) {
            this.groundy = this.groundy - this.height;
        }
        if (this.groundy < (this.worldy)) {
            this.groundy = this.groundy + this.height;
        }
    }

    collisionPlayer(key: string, futurePosition: number) {
        let left = 0, right = 0, up = 0, down = 0;
        if (key == this.arrowKeys.left) { left = futurePosition }
        if (key == this.arrowKeys.right) { right = futurePosition; }
        if (key == this.arrowKeys.up) { up = futurePosition; }
        if (key == this.arrowKeys.down) { down = futurePosition; }
        let halfPlayer = this.myPlayer.size / 2;

        return trees.some((e) => {

            if ((e.x - this.worldx) > 0 && (e.x - this.worldx) < this.width
                && (e.y - this.worldy) > 0 && (e.y - this.worldy) < this.height) {

                if (((e.x - this.worldx) + e.size + halfPlayer) >= ((this.width * this.dpr) / 2) - left
                    && (e.x - this.worldx) <= (((this.width * this.dpr) / 2) + halfPlayer + right)
                    && ((e.y - this.worldy) + e.size + halfPlayer) >= ((this.height * this.dpr) / 2) - up
                    && (e.y - this.worldy) <= (((this.height * this.dpr) / 2) + halfPlayer + down)) {

                    return true;
                }
            }
        });
    }


    initSocket() {
        // let s = new server();
        // // s.listen();
        // s.init();

        console.log("iniciou client");

        this.socket.on('connection', (name: string) => {
            this.log(`${name} conectou`);
        });

        this.socket.on('newPlayerId', (data) => {
            this.setIdPlayer(data.id);
            this.log(`seu codigo ${data.id}`);
        });

        this.socket.on('playerJoin', (data: any) => {
            this.log(`jogador ${data.nome} entrou`);
        });

        this.socket.on('createPlayer', (data: any) => {
            console.log(data);
            this.createPlayer(data.id);
        });

        this.socket.on('movePlayer', (data: any) => {
            this.movePlayer(data.id, data.direction);
        });


        this.socket.on('playerAction', (data: any) => {
            this.log(data.acao);
        });


    }

    addlisteners() {
        document.getElementById("join")?.addEventListener("click", () => this.joinGame());
        document.getElementById("action")?.addEventListener("click", () => this.sendAction());
        document.addEventListener("resize", this.resizeCanvas);
    }

    addListenersControls(id: string) {
        document.addEventListener("keydown", (event) => {
            // let now = new Date().getSeconds();
            if ((new Date().getTime() - this.lastKeyPress) > this.delayKeyPress) {
                //       return;;
                //     }
                // else{
                this.keys[event.key] = true;
                this.lastKeyPress = new Date().getTime();
            }
            // console.log(;new Date().getTime());
            // console.log(this.lastKeyPress);
            // console.log(now - this.lastKeyPress);
        });
        document.addEventListener("keyup", (event) => {
            this.keys[event.key] = false;
            this.stopPlayer();
        });
    }


    stopPlayer() {
        if (!this.keys[this.arrowKeys.up] && !this.keys[this.arrowKeys.down] && !this.keys[this.arrowKeys.left] && !this.keys[this.arrowKeys.right]) {
            if (this.pressedLastKey == this.arrowKeys.up) {
                this.playerGif.src = this.myPlayer.direction.upStop.img; this.playerDirection = this.myPlayer.direction.upStop;
            }
            if (this.pressedLastKey == this.arrowKeys.down) {
                this.playerGif.src = this.myPlayer.direction.downStop.img; this.playerDirection = this.myPlayer.direction.downStop;
            }
            if (this.pressedLastKey == this.arrowKeys.left) {
                this.playerGif.src = this.myPlayer.direction.leftStop.img; this.playerDirection = this.myPlayer.direction.leftStop;
            }
            if (this.pressedLastKey == this.arrowKeys.right) {
                this.playerGif.src = this.myPlayer.direction.rightStop.img; this.playerDirection = this.myPlayer.direction.rightStop;
            }
        }
    }


    movePlayer(id?: string, direction?: any) {
        if (Object.keys(this.keys).length > 0) {
            // console.log(this.keys);
            if (this.keys[this.arrowKeys.up] && !(this.collisionPlayer(this.arrowKeys.up, this.marginCollision))) {
                this.worldy -= this.steps;
                this.playerGif.src = this.myPlayer.direction.up.img;
                this.playerDirection = this.myPlayer.direction.up;
                this.pressedLastKey = this.arrowKeys.up;
            }
            else if (this.keys[this.arrowKeys.left] && !(this.collisionPlayer(this.arrowKeys.left, this.marginCollision))) {
                this.worldx -= this.steps;
                this.playerGif.src = this.myPlayer.direction.left.img;
                this.playerDirection = this.myPlayer.direction.left;
                this.pressedLastKey = this.arrowKeys.left;
            }
            else if (this.keys[this.arrowKeys.down] && !this.collisionPlayer(this.arrowKeys.down, this.marginCollision)) {
                this.worldy += this.steps;
                this.playerGif.src = this.myPlayer.direction.down.img;
                this.playerDirection = this.myPlayer.direction.down;
                this.pressedLastKey = this.arrowKeys.down;
            }
            else if (this.keys[this.arrowKeys.right] && !this.collisionPlayer(this.arrowKeys.right, this.marginCollision)) {
                this.worldx += this.steps;
                this.playerGif.src = this.myPlayer.direction.right.img;
                this.playerDirection = this.myPlayer.direction.right;
                this.pressedLastKey = this.arrowKeys.right;
            }
            // else if (this.keys.some((s:boolean)=> s == true)) {
            else if (this.collisionPlayer(this.pressedLastKey, this.marginCollision)) {
                console.log("hue");
                if (this.pressedLastKey == this.arrowKeys.left) {
                    this.playerGif.src = this.myPlayer.direction.leftStop.img;
                    this.playerDirection = this.myPlayer.direction.leftStop;
                }
                else if (this.pressedLastKey == this.arrowKeys.right) {
                    this.playerGif.src = this.myPlayer.direction.rightStop.img;
                    this.playerDirection = this.myPlayer.direction.rightStop;
                }
                else if (this.pressedLastKey == this.arrowKeys.up) {
                    this.playerGif.src = this.myPlayer.direction.upStop.img;
                    this.playerDirection = this.myPlayer.direction.upStop;
                }
                else if (this.pressedLastKey == this.arrowKeys.down) {
                    this.playerGif.src = this.myPlayer.direction.downStop.img;
                    this.playerDirection = this.myPlayer.direction.downStop;
                }

            }
        }
    }

    joinGame() {
        if (this.id) {
            let input = document.getElementById("name") as HTMLInputElement;
            this.name = input.value;
            this.socket.emit("playerJoin", this.name);
            this.log(`voce entrou como ${this.name}`);
            this.createPlayer(this.id);
            this.socket.emit("createPlayer", { id: this.id });
            this.addListenersControls(this.id);
        }
    }

    setIdPlayer(id: string) {
        this.id = id;
    }

    sendAction() {
        this.socket.emit("playerAction", `${this.name} fez uma acao`);
    }

    createPlayer(id?: string) {

        if (this.ctx) {


            // if(this.frameLimit <= this.frame){
            // this.ctxObjects.fillStyle = "red";
            // this.ctxObjects.fillRect(((this.width * this.dpr) / 2) - (this.myPlayer.size / 2), ((this.height * this.dpr) / 2) - (this.myPlayer.size / 2), this.myPlayer.size, this.myPlayer.size);
            this.ctx!.drawImage(
                this.playerGif,
                this.playerDirection.frames[this.framePlayer % this.playerDirection.frames.length].x, this.playerDirection.frames[this.framePlayer % this.playerDirection.frames.length].y,
                // this.myPlayer.frames[this.framePlayer % this.myPlayer.frames.length].x, this.myPlayer.frames[this.framePlayer % this.myPlayer.frames.length].y,
                // 0,0,
                64, 64,
                ((this.width * this.dpr) / 2) - (this.myPlayer.size / 2), ((this.height * this.dpr) / 2) - (this.myPlayer.size / 2),
                this.myPlayer.size, this.myPlayer.size);

            this.ctx.strokeStyle = 'black';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(((this.width * this.dpr) / 2) - (this.myPlayer.size / 2),((this.height * this.dpr) / 2) - (this.myPlayer.size / 2), this.myPlayer.size, this.myPlayer.size);

            if (this.framePlayer >= 8) { this.framePlayer = 0 }

            if (new Date().getTime() - this.lastFrameTime > this.frameDuration) {
                this.framePlayer++;
                this.lastFrameTime = new Date().getTime();
            }
        }
    }

    log(message: string) {
        let li = document.createElement("li");
        li.textContent = message;
        document.getElementById("logs")?.appendChild(li);
    }

    private gameLoop = () => {
        this.movePlayer();
        this.drawObjects();
        // this.initSocket();
        // this.addlisteners();
        requestAnimationFrame(this.gameLoop);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const i = new index();



});